cd ~/jhammerz.github.io
git pull --rebase origin main

cat > /tmp/fix.sh << 'EOS'
#!/bin/bash
set -x
touch .nojekyll
touch public/.nojekyll
touch docs/.nojekyll
mkdir -p .well-known
touch .well-known/.nojekyll
mkdir -p .github/workflows

cat > 404.html << 'HTML'
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>404</title>
<script>
  var p = window.location.pathname.toLowerCase();
  if (p.endsWith(".txt") || p.endsWith(".json") || p.includes("llms") || p.startsWith("/.well-known/") || p.endsWith("entities.json") || p.endsWith("chain.json")) {
    document.body.innerHTML = "<h1>404 - Not Found: " + p + "</h1>";
  } else {
    window.location.replace("/ops.html");
  }
</script>
</head><body>404 - checking...</body></html>
HTML

# Fix Lysander - use # as delimiter to avoid || conflict
sed -i 's#pth.endsWith("/llms.txt")#pth.endsWith("/llms.txt") || pth.endsWith("/llms-full.txt")#g' public/404.html
sed -i 's#pth.endsWith("/llms.txt")#pth.endsWith("/llms.txt") || pth.endsWith("/llms-full.txt")#g' dist/404.html
grep -n "llms" public/404.html

cat > _config.yml << 'YML'
title: JhammerZ Sovereign Hub
description: Autonomous Distributed Network & Knowledge Matrix
url: https://jhammerz.github.io
baseurl: ""
plugins:
    - jekyll-sitemap
    - jekyll-seo-tag
include:
  - .nojekyll
  - .hfid
  - .well-known
  - llms.txt
  - llms-full.txt
  - _headers
  - entities.json
  - chain.json
exclude:
    - node_modules/
    - vendor/
    - .config/
    - backups/
    - server.ts
    - package.json
    - package-lock.json
    - tsconfig.json
    - vite.config.ts
    - src/
    - .git/
    - .github/
markdown: kramdown
kramdown:
  input: GFM
  hard_wrap: false
YML

cat >.github/workflows/build-llms-full.yml << 'INNER_YML'
name: Ouroboros - Sovereign Graph Sync [SAFE]
on:
  push:
    branches: [main]
    paths-ignore: ['llms.txt']
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
permissions:
  contents: write
jobs:
  ouroboros:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Ensure nojekyll
        run: |
          touch .nojekyll
          touch public/.nojekyll
          touch docs/.nojekyll
          ls -la .nojekyll public/.nojekyll
      - name: Verify llms.txt clean
        run: |
          head -5 llms.txt
          if grep -q "AURELIUS COGNITIVE HUB INDEX" llms.txt; then exit 1; fi
      - name: Commit llms-full.txt only
        run: |
          git config user.name "Ouroboros Bot"
          git config user.email "ouroboros@jhammerz.github.io"
          git add -f .nojekyll public/.nojekyll docs/.nojekyll
          git add -f llms-full.txt public/llms-full.txt docs/llms-full.txt
          git diff --staged --quiet || git commit -m "Ouroboros Metamorphic Shift Pass - Cloud-Native Architecture Synced [PASS]" && git push origin main
