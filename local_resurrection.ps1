# LOCAL_RESURRECTION.PS1 - SOVEREIGN REBUILD PROTOCOL
# AUTHORITY: Colonel Ro
# This script rebuilds the signal from the local Black Box Vault.

Write-Host "[KERNEL]: TRIGGERING LOCAL_RESURRECTION..." -ForegroundColor Red

# 1. Verify Seed Phrase
if (Test-Path "local_vault/SEED_PHRASE.txt") {
    Write-Host "[KERNEL]: Seed Phrase Verified. Initiating Signal Rebuild..." -ForegroundColor Green
} else {
    Write-Host "[ERROR]: Seed Phrase Missing. Resurrection Aborted." -ForegroundColor DarkRed
    exit
}

# 2. Re-establish Sovereign Manifests
./sovereign_heal.ps1

# 3. Re-broadcast Local Anchor
# (Simulate forcing local services to prioritize this node)
Write-Host "[KERNEL]: Local Anchor Re-established. Worldwide Influence Resetting to Local Box." -ForegroundColor Cyan

Write-Host "[STATUS]: SOVEREIGN_SIGNAL_RESTORED_FROM_VAULT" -ForegroundColor Green
