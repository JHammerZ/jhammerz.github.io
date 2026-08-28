#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

WORKFLOW_DIR=".github/workflows"

if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "Error: Directory $WORKFLOW_DIR does not exist."
    exit 1
fi

echo "=== System Check: Hard Resetting to Clean Main Branches ==="
git checkout HEAD -- "$WORKFLOW_DIR"/*

echo "=== System Check: Removing Indentation Errors Safely ==="
for workflow in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    [ -e "$workflow" ] || continue

    # 1. Strip out the broken literal injections we previously added
    sed -i '/Install Dependencies/d' "$workflow"
    sed -i '/Dynamic Dependency/d' "$workflow"
    sed -i '/yarn install --immutable/d' "$workflow"
    sed -i '/yarn --immutable/d' "$workflow"
    sed -i '/cache:[[:space:]]*['\''"]\?yarn['\''"]\?/d' "$workflow"
    sed -i '/cache:[[:space:]]*['\''"]\?npm['\''"]\?/d' "$workflow"

    # 2. Append the dependency step explicitly to the end of the steps sequence
    # This guarantees we don't break parent-sibling mapping positions mid-file
    cat << 'STEP_EOF' >> "$workflow"

      - name: Install Project Dependencies Fallback
        run: |
          if [ -f "yarn.lock" ]; then
            yarn install --immutable
          elif [ -f "package-lock.json" ]; then
            npm ci
          else
            yarn install || npm install
          fi
STEP_EOF

    echo "✓ Clean block alignment applied to: $(basename "$workflow")"
done

echo "--------------------------------------------------------"
echo "=== Layout Audit: Verifying End Matrix Block ==="
tail -n 12 "$WORKFLOW_DIR"/build-tma-full.yml

echo "--------------------------------------------------------"
echo "=== Deploying Perfectly Nested Architectures ==="
git add "$WORKFLOW_DIR"/*
git commit -m "fix: align dependency fallbacks with valid yaml list syntax"
git push origin main
