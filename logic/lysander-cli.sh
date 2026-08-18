#!/bin/bash
# LYSANDER COMMAND-LINE INTERFACE
echo "Master Architect Command Received."
case $1 in
  "burst") python3 logic/social_broadcaster.py ;;
  "repair") bash logic/repair.sh ;;
  "status") cat forensics/sentinel.log ;;
  *) echo "Usage: lysander-cli [burst|repair|status]" ;;
esac
#!/bin/bash
# LYSANDER COMMAND-LINE INTERFACE - v2.0
case $1 in
  "burst") 
    python3 logic/tiktok_distributor.py
    python3 logic/social_broadcaster.py --library-all
    ;;
  "status") python3 forensics/sentinel_audit.py ;;
  *) echo "Usage: lysander-cli [burst|status]" ;;
esac
#!/bin/bash
# JHAMMERZ SOVEREIGN CLI
case $1 in
  "hunt") python3 agents/bounty_hunter.py ;;
  "stop") python3 security/kill_switch.py ;;
  "vault") python3 security/treasury_vault.py ;;
  *) echo "Usage: lysander-cli [hunt|stop|vault]" ;;
esac
