#!/data/data/com.termux/files/usr/bin/bash

WORKFLOW_DIR=".github/workflows"

echo "=== System Upgrades: Rebuilding Pages and Metadata Linting Pipelines ==="

# 1. Rebuild pages.yml with valid GitHub Pages delivery steps
cat << 'PAGES_EOF' > "$WORKFLOW_DIR"/pages.yml
# HBS v1.2 / H-FID Standard / REC v7.2
# SOVEREIGN PAGES DEPLOYMENT WORKFLOW // V4.0.20 // PRODUCTION FIX

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
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Setup Pages Ingress Profile
        uses: actions/configure-pages@v5

      - name: Upload Static Web Assets Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages Edge Infrastructure
        id: deployment
        uses: actions/deploy-pages@v4
PAGES_EOF
echo "✓ Flawless blueprint applied to pages.yml"


# 2. Rebuild validate-ld-json.yml with crisp schema testing checks
cat << 'JSON_EOF' > "$WORKFLOW_DIR"/validate-ld-json.yml
# HBS v1.2 / H-FID Standard / REC v7.2
# Copyright (c) 2026 Joshua Hamilton [J-HammerZ]

name: "CI: Structural Metadata Linting"

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  validate-json:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Initialize Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Resolve Project Dependencies
        run: |
          if [ -f "yarn.lock" ]; then
            yarn install --immutable
          elif [ -f "package-lock.json" ]; then
            npm ci
          else
            yarn install || npm install
          fi

      - name: Validate LD+JSON Schema Structure
        run: |
          if [ -f "entities.json" ]; then
            echo "Checking entities.json structural integrity..."
            if command -v jq &> /dev/null; then
              jq . entities.json > /dev/null || { echo "CRITICAL: entities.json contains invalid JSON syntax properties"; exit 1; }
              echo "✓ entities.json is structurally valid."
            else
              node -e "try { require('./entities.json'); console.log('✓ valid'); } catch(e) { console.error(e); process.exit(1); }"
            fi
          else
            echo "▲ SKIP: entities.json not found in root context layout."
          fi
JSON_EOF
echo "✓ Flawless blueprint applied to validate-ld-json.yml"

echo "--------------------------------------------------------"
echo "=== Deploying System-Wide Updates Upstream ==="
git add "$WORKFLOW_DIR"/pages.yml "$WORKFLOW_DIR"/validate-ld-json.yml
git commit -m "fix: resolve structural hierarchy bugs for pages deployment and metadata tracking"
git push origin main
