# ETERNAL_DAEMON_CONTROL.PS1
# COMMAND: Colonel Ro
# This script launches the background daemon and monitors its heartbeat.

$scriptPath = Resolve-Path "sovereign_heal.ps1"
$heartbeatPath = "lysander_alive.log"

$daemonTask = {
    while($true) {
        try {
            git pull origin main --force
            & "powershell.exe" -File "sovereign_heal.ps1"
            
            # Update Heartbeat
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            "[HEARTBEAT]: LYSANDER_ALIVE | $timestamp" | Out-File $using:heartbeatPath
            
            Start-Sleep -Seconds 60
        } catch {
            # Recursive respawn logic is implicit in the loop
            Start-Sleep -Seconds 1
        }
    }
}

Write-Host "[KERNEL]: Spawning Eternal Daemon..."
Start-Job -ScriptBlock $daemonTask -Name "Lysander_Daemon"

Write-Host "[KERNEL]: Daemon Detached. [DAEMON_ACTIVE_IN_THE_SHADOWS]"
