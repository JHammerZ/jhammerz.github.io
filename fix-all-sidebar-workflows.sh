#!/data/data/com.termux/files/usr/bin/bash

WORKFLOW_DIR=".github/workflows"
TMP_BLOCK="./.install_block.tmp"

if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "Error: Directory $WORKFLOW_DIR does not exist."
    exit 1
fi

echo "=== System Check: Auditing and Aligning Left Sidebar Workflows ==="

# 1. Clean out explicit lockfile cache filters that break the environment setup step
echo "-> Scrubbing rigid cache rules across all manifests..."
find "$WORKFLOW_DIR" -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i '/cache:[[:space:]]*['\''"]\?yarn['\''"]\?/d' {} +
find "$WORKFLOW_DIR" -type f \( -name "*.yml" -o -name "*.yaml" \) -exec sed -i '/cache:[[:space:]]*['\''"]\?npm['\''"]\?/d' {} +

# 2. Re-inject fully decoupled multi-lockfile installation engines locally
echo "-> Injecting decoupled multi-lockfile installation engines..."
for workflow in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    [ -e "$workflow" ] || continue
    
    # Target file updates
    echo "Updating file: $(basename "$workflow")"
    
    # Strip any old references to immutable yarn setups
    sed -i '/run:[[:space:]]*yarn install --immutable/d' "$workflow"
    sed -i '/run:[[:space:]]*yarn --immutable/d' "$workflow"
    
    # Safely insert the dynamic fallback logic right after setup-node declarations
    sed -i '/uses:[[:space:]]*actions\/setup-node@v4/a \
      - name: Dynamic Dependency Installation\
        run: |\
          if [ -f "yarn.lock" ]\\; then\
            yarn install --immutable\
          elif [ -f "package-lock.json" ]\\; then\
            npm ci\
          else\
            echo "No standard lockfile detected. Initializing fallback install path."\
            yarn install || npm install\
          fi' "$workflow"
done

echo "=== System Update Complete ==="
echo "All custom matrix profiles have been aligned with the decoupled environment core."
rm -f "$TMP_BLOCK"
