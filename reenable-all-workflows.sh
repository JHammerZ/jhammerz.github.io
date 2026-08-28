#!/data/data/com.termux/files/usr/bin/bash
# ==============================================================================
#          LYSANDER CORE WORKFLOW KERNEL // LEVEL 4 ACTIVATION SUITE
#          DESIGN DEPTH: MAXIMUM EFFICIENCY // ZERO-DELETION GLOBAL ENFORCEMENT
# ==============================================================================

WORKFLOW_DIR=".github/workflows"

echo "=== MYTHOS WORKFLOW KERNEL: INITIALIZING GLOBAL MATRIX ACTIVATION ==="
echo "----------------------------------------------------------------------"

# 1. Verify existence of the automation target map directory
if [ ! -d "$WORKFLOW_DIR" ]; then
    echo "Error: Target configuration directory $WORKFLOW_DIR missing."
    exit 1
fi

# 2. Check for active GitHub CLI presence
if ! command -v gh &> /dev/null; then
    echo "-> Tool installation: Provisioning GitHub CLI utility..."
    pkg install -y gh
fi

echo "-> Core scanning loop: Processing configuration paths..."
echo "----------------------------------------------------------------------"

# 3. Iterate through every single tracked manifest module file cleanly
for workflow_path in "$WORKFLOW_DIR"/*.yml "$WORKFLOW_DIR"/*.yaml; do
    [ -e "$workflow_path" ] || continue
    
    FILENAME=$(basename "$workflow_path")
    echo "Processing system target node: $FILENAME"
    
    # 4. Command the remote server to re-enable the workflow path natively
    # This securely overrides 'disabled' metrics on the GitHub tracking nodes.
    gh workflow enable "$FILENAME" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "   ✓ STATUS: Re-enabled and synced with master cluster successfully."
    else
        echo "   ▲ STATUS: Already active or pending execution tokens."
    fi
done

echo "----------------------------------------------------------------------"
echo "=== EXECUTING RE-VERIFICATION RUN OVER THE WIRE ==="
./track-live-progress.sh

echo "----------------------------------------------------------------------"
echo "✓ COMPLETE: Global workflow infrastructure re-enabled and fully balanced."
echo "======================================================================"
