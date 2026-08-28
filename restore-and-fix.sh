#!/data/data/com.termux/files/usr/bin/bash

WORKFLOW_DIR=".github/workflows"

echo "=== Restoring Repository Infrastructure ==="
# 1. Bring back any files from the backup directory immediately
if [ -d ".workflow_backup" ]; then
    mv .workflow_backup/* "$WORKFLOW_DIR"/ 2>/dev/null
    rmdir .workflow_backup
fi

# 2. Hard reset to ensure every original file tracking index is intact
git checkout HEAD -- "$WORKFLOW_DIR"/*

echo "=== Re-Fixing Layout Syntax Errors with Native Script Templates ==="

# Repair pages.yml structure safely from scratch while preserving it
cat << 'PAGES_EOF' > "$WORKFLOW_DIR"/pages.yml
name: Deploy Site to Pages
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: "pages"
  cancel-in-progress: false
jobs:
  deploy-pages:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - id: deployment
        uses: actions/deploy-pages@v4
PAGES_EOF

# Repair validate-ld-json.yml layout errors
cat << 'JSON_EOF' > "$WORKFLOW_DIR"/validate-ld-json.yml
name: "CI: Structural Metadata Linting"
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:
jobs:
  validate-json:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate JSON Structure
        run: |
          if [ -f "entities.json" ]; then
            node -e "try { require('./entities.json'); console.log('✓ valid'); } catch(e) { process.exit(1); }"
          else
            echo "Skipped: entities.json not found."
          fi
JSON_EOF

echo "=== Verification Check ==="
git status "$WORKFLOW_DIR"

echo "=== Submitting Live Pipeline Corrections Upstream ==="
git add "$WORKFLOW_DIR"/*
git commit -m "fix: restore all repository workflows and correct formatting arrays"
git push origin main
