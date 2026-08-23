#!/bin/bash
# ==============================================================================
# AURELIUS SOVEREIGN ORCHESTRATOR - AUTOMATED BACKUP PROXIMAL PIPELINE
# TARGET WINDOW: BEFORE AUGUST 23, 2026 CUTOFF
# ==============================================================================

# Define absolute local repository pathways
BACKUP_DIR="${HOME}/manus_emergency_backup_2026"
STAGE_DIR="${HOME}/.config/manus"
REPO_ASSETS="./assets/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_FILE="manus_core_vault_${TIMESTAMP}.tar.gz"

echo "=== [INITIALIZING SOVEREIGN TASK PROFILE SNAPSHOT] ==="

# 1. Enforce local environment directory validation
mkdir -p "$BACKUP_DIR"
mkdir -p "$REPO_ASSETS"

if [ ! -d "$STAGE_DIR" ]; then
    echo "[!] Notice: Source path $STAGE_DIR not found in default home path. Searching local fallback..."
    if [ -d "./.config/manus" ]; then
        STAGE_DIR="./.config/manus"
    else
        STAGE_DIR=$(pwd)
    fi
fi

echo "[*] Packaging active configurations from: $STAGE_DIR"

# 2. Package and compress the workspace profiles into an isolated tarball
tar --exclude="./node_modules" --exclude="./dist" --exclude="./.git" --exclude="*.log" --exclude="*.tmp" -czvf "${BACKUP_DIR}/${OUTPUT_FILE}" -C "$STAGE_DIR" . 2>/dev/null || tar -czvf "${BACKUP_DIR}/${OUTPUT_FILE}" -C "$STAGE_DIR" .

if [ $? -eq 0 ]; then
    echo "[✓] SUCCESS: Sealed tarball generated inside $BACKUP_DIR"
    
    # 3. Generate a strict cryptographic SHA-256 validation checksum
    echo "[*] Generating cryptographic hash validation sign..."
    sha256sum "${BACKUP_DIR}/${OUTPUT_FILE}" > "${BACKUP_DIR}/${OUTPUT_FILE}.sha256"
    cat "${BACKUP_DIR}/${OUTPUT_FILE}.sha256"
    
    # 4. Sync the backup archive directly into your static repository asset pipeline
    echo "[*] Re-routing sealed archive to public static substrate pipeline..."
    cp "${BACKUP_DIR}/${OUTPUT_FILE}" "$REPO_ASSETS/"
    cp "${BACKUP_DIR}/${OUTPUT_FILE}.sha256" "$REPO_ASSETS/"
    echo "[✓] ARCHIVE ROUTED: Backup safely staged inside your repository path: $REPO_ASSETS/"
else
    echo "[X] ERROR: Tarball packing routine failed. Check terminal write permissions."
    exit 1
fi

echo "=== [SOVEREIGN MATRIX BACKUP SEEP COMPLETE] ==="
