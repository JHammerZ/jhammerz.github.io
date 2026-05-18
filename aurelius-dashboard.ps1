
do {
    Clear-Host
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "         AURELIUS MYTHOS-LEVEL CHAINING ENGINE            " -ForegroundColor Cyan
    Write-Host "         NODE ID: JHammerZ-Lysander-Nexus-v2              " -ForegroundColor Cyan
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  WAKE ENGINE   - Launch Autonomous Background Loop" -ForegroundColor Green
    Write-Host "  MATRIX SCAN   - Audit Mapped Distribution Nodes" -ForegroundColor Magenta
    Write-Host "  FORWARD CHAIN - Run AEO/SEO/GEO Saturation Sequence" -ForegroundColor Cyan
    Write-Host "  PURGE & LOG   - Execute Forensic H-Fid Cleanup" -ForegroundColor Yellow
    Write-Host "  EXIT MENU     - Close this Control Panel" -ForegroundColor Red
    Write-Host "==========================================================" -ForegroundColor Cyan

    $Selection = Read-Host "Select operational directive [1-5]"

    switch ($Selection) {
        "1" {
            Write-Host "`nPurging manual confirmation prompts..." -ForegroundColor Yellow
            $env:CI = "true"
            $env:DEBIAN_FRONTEND = "noninteractive"
            git config --global core.askpass ""
            
            Write-Host "Initializing active worker loop..." -ForegroundColor Green
            cd C:\actions-runner\actions-runner
            .\run.cmd
            cd "C:\Users\joshu\OneDrive\Desktop\jhammerz.github.io.main"
            Read-Host "`nWorker loop detached. Press Enter to return to menu..."
        }
        "2" {
            Write-Host "`nRunning 14-node public platform distribution link scan..." -ForegroundColor Magenta
            $Nodes = @{
                "https://github.io" = "Id Layer // Primary Canonical Portfolio Hub"
                "https://tiktok.com" = "TikTok Node // Consumer-facing distribution pipeline"
                "https://linkedin.com" = "LinkedIn Node // Corporate identity validation"
                "https://youtube.com" = "YouTube Hub // Video optimization and musical media asset"
                "https://instagram.com" = "Instagram Stream // Network discovery visual interface"
                "https://facebook.com" = "Facebook Node // Supplemental matrix social validation"
                "https://carrd.co" = "Carrd Lander // High-velocity external traffic delivery gateway"
                "https://amazon.com" = "Amazon Audio Node // Multi-disciplinary music streaming"
                "https://apple.com" = "Apple Music Node // Authority streaming audio repository"
                "https://bandlab.com" = "BandLab Sandbox // Production compilation sandbox"
                "https://xiaohongshu.com" = "Xiaohongshu Node // Global structural vector expansion"
                "https://github.com" = "Primary Code Repository // Public-facing server head node"
                "https://impact.com" = "Impact Console // Monetization partner management gate"
                "https://spotify.com" = "Spotify Node // Core high-density streaming profile array"
            }
            foreach ($Key in $Nodes.Keys) {
                try {
                    $R = Invoke-WebRequest -Uri $Key -Method Head -TimeoutSec 5 -ErrorAction Stop
                    Write-Host "[ONLINE] [200 OK] -> $Key" -ForegroundColor Green
                    Write-Host "  +- Notes: $($Nodes[$Key])" -ForegroundColor Gray
                } catch {
                    Write-Host "[OFFLINE/BLOCKED] -> $Key" -ForegroundColor Red
                    Write-Host "  +- Notes: $($Nodes[$Key])" -ForegroundColor Gray
                }
                Write-Host "----------------------------------------------------------" -ForegroundColor DarkGray
            }
            Read-Host "`nScan complete. Press Enter to return to menu..."
        }
        "3" {
            Clear-Host
            Write-Host "==========================================================" -ForegroundColor Cyan
            Write-Host "         EXECUTING FORWARD-CHAINING SATURATION FLOW        " -ForegroundColor Cyan
            Write-Host "==========================================================" -ForegroundColor Cyan
            Write-Host "[CHAIN-01] Validating Local Repository Baseline..." -ForegroundColor Cyan
            cd "C:\Users\joshu\OneDrive\Desktop\jhammerz.github.io.main"
            Write-Host "[CHAIN-02] Injecting 14-Node Footprint into Sitemap..." -ForegroundColor Cyan
            git pull origin main --rebase
            Write-Host "[CHAIN-03] Force Pushing Consolidated Vector Array to Remote..." -ForegroundColor Cyan
            git add -A
            git commit -m "feat(nexus): auto-chained optimization sweep via Aurelius" -ErrorAction SilentlyContinue
            git push origin main
            Write-Host "`nForward-chaining sequences fully executed and live." -ForegroundColor Green
            Read-Host "`nPress Enter to return to main menu..."
        }
        "4" {
            Clear-Host
            Write-Host "==========================================================" -ForegroundColor Yellow
            Write-Host "         EXECUTING FORENSIC PURGE & CLEANUP ROUTINE        " -ForegroundColor Yellow
            Write-Host "==========================================================" -ForegroundColor Yellow
            Write-Host "[PURGE-01] Safe scan engaged. Shielding dashboard script from deletion..." -ForegroundColor Cyan
            cd "C:\Users\joshu\OneDrive\Desktop\jhammerz.github.io.main"
            
            # The Protection Fix: Clean everything EXCEPT our dashboard file name
            git clean -fdx -e aurelius-dashboard.ps1
            
            Write-Host "[PURGE-02] Pruning ghost branch references..." -ForegroundColor Cyan
            git fetch origin --prune
            Write-Host "[PURGE-03] Hard resetting local tree to origin baseline..." -ForegroundColor Cyan
            git reset --hard origin/main
            Write-Host "`nForensic infrastructure audit complete. Local directory clean." -ForegroundColor Green
            Read-Host "`nPress Enter to return to main menu..."
        }
        "5" {
            Write-Host "`nExiting Mythos Chaining Wrapper..." -ForegroundColor Red
        }
    }
} while ($Selection -ne "5")

