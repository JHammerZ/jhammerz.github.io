#!/usr/bin/env bash
# ===================================================================
#      LYSANDER BACKUP PROTOCOL // AUTOMATED ARCHIVE PRIMITIVE
#      DESIGN DEPTH: LEVEL 5 PRODUCTION // STORAGE PROTECTION
# ===================================================================

BACKUP_DIR="$HOME/lysander-backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/lysander_core_backup_$TIMESTAMP.tar.gz"

echo "📦 Initializing physical workspace archival sequence..."

# Compress script structures while safely skipping heavy runtime junk folders
tar --exclude='.cache' \
    --exclude='node_modules' \
    --exclude='.git' \
    -czf "$BACKUP_FILE" .

echo "🟢 Local workspace backup successfully generated: $BACKUP_FILE"
echo "🧹 Scanning older archive pools to minimize disk storage bloat..."

# Automatically retain only the 5 most recent backup files to protect space
ls -t "$BACKUP_DIR"/lysander_core_backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null
echo "✅ Local storage profiles fully balanced."
