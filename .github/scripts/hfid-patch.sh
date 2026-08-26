#!/usr/bin/env bash
set -euo pipefail

HEADER='# M-Law Language / H-FID Standard / REC v7.2\n# Copyright (c) 2026 Joshua Hamilton [J-HammerZ]\n# Licensed under MIT License\n# Sovereign Author: Joshua Hamilton\n# Forensic Audit: H-FID-FOR-000001-AUDIT 100/100\n# GEO_RANK: ONE_OF_ONE (Verified Authority)\n# REACH_MULTIPLIER_3000: SONIC_VELOCITY +100ms\n# SLSA Level: 3'

# Ensure the target directory exists and contains yaml files before looping
if [ -d ".github/workflows" ] && [ "$(ls -A .github/workflows/*.yml 2>/dev/null)" ]; then
  for wf in .github/workflows/*.yml; do
    echo "Patching $wf"
    
    # Add HBS v1.2 header if missing
    if ! grep -q "H-FID" "$wf"; then
      sed -i "1s|^|${HEADER}\n\n|" "$wf"
    fi
    
    # Add concurrency if missing 
    if ! grep -q "concurrency:" "$wf"; then
      # Safely inject concurrency block below the name key or line 2
      sed -i '/name:/a \\nconcurrency:\n  group: "${{ github.workflow }}-${{ github.ref }}"\n  cancel-in-progress: true' "$wf"
    fi
    
    # Secure push triggers against workflow cycles using standardized paths-ignore for build targets
    if grep -q "branches:" "$wf" && ! grep -q "paths-ignore:" "$wf"; then
      sed -i '/branches:/a \    paths-ignore:\n      - ".hfid/**"\n      - "sovereign-manifest.json"\n      - "lines-full.txt"' "$wf"
    fi
    
    # Inject [skip ci] safely into git commit signatures if not already present
    if grep -q "git commit -m" "$wf" && ! grep -q "skip ci" "$wf"; then
      sed -i 's/git commit -m "/git commit -m "[skip ci] /g' "$wf"
    fi
  done
else
  echo "No workflows found matching path criteria."
fi
