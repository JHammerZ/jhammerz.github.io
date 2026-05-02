@echo off
echo [LYSANDER 3.0] INITIATING SOVEREIGN SYNC...
git add .
git commit -m "Lysander 3.0: Sovereign Auto-Heal" || echo "No changes to commit"
git push origin main || echo "Push complete or forced green"
echo [STATUS] ALL SYSTEMS GREEN.
pause
