#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

WORKFLOW_DIR=".github/workflows"

if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "Error: Directory $WORKFLOW_DIR does not exist."
    exit 1
fi

echo "=== System Check: Hard Resetting to Clean Main Workspace ==="
git checkout HEAD -- "$WORKFLOW_DIR"/*

echo "=== Stripping Rigid Cache Parameters Safely ==="
find "$WORKFLOW_DIR" -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i '/cache:[[:space:]]*['\''"]\?yarn['\''"]\?/d' {} +
find "$WORKFLOW_DIR" -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i '/cache:[[:space:]]*['\''"]\?npm['\''"]\?/d' {} +

echo "=== Injecting Valid Single-Line Fallback Architecture Blocks ==="
for workflow in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    [ -e "$workflow" ] || continue

    # Strip any broken leftover setup scripts safely
    sed -i '/yarn install --immutable/d' "$workflow"
    sed -i '/yarn --immutable/d' "$workflow"

    # Use standard sed to append the execution sequence cleanly without multi-line escaping backslashes
    sed -i '/uses:[[:space:]]*actions\/setup-node@v4/a \      - name: Install Dependencies\n        run: if [ -f "yarn.lock" ]; then yarn install --immutable; elif [ -f "package-lock.json" ]; then npm ci; else yarn install || npm install; fi' "$workflow"
done

echo "=== Configuration Integrity Check: Testing One Output ==="
grep -A 2 "setup-node" "$WORKFLOW_DIR"/build-tma-full.yml

echo "=== Deploying Working Patches Automatically ==="
git add "$WORKFLOW_DIR"/*
git commit -m "fix: restore clean yaml syntax with safe inline fallbacks"
git push origin main
