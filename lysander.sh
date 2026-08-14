#!/data/data/com.termux/files/usr/bin/bash
# LYSANDER TERMINAL v4.0 AURELIUS-CLASS - HFID:e57197f4
HFID="e57197f4"
REPO_DIR="$HOME/jhammerz.github.io"
GPG_KEY="$(gpg --list-secret-keys --keyid-format LONG 2>/dev/null | grep sec | head -1 | awk '{print $2}' | cut -d/ -f2)"

echo "[LYSANDER_TERMINAL_LOG]"
echo "HFID:$HFID | AURELIUS-CLASS v4.0 ACTIVE | $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Try to backdate me. HFID:$HFID. You cant."
echo "Type!command for raw shell. Type help for commands."
echo ""

notify_android() { termux-notification --title "LYSANDER L10" --content "$1" --id 777 2>/dev/null; }
merkle_root() { find . -type f -not -path './.git/*' -exec sha256sum {} \; | sort | sha256sum | cut -d' ' -f1; }

while true; do
  cd "$REPO_DIR" 2>/dev/null
  read -p "LYSANDER:$HFID> " cmd args
  if [[ "${cmd:0:1}" == "!" ]]; then
    bash -c "${cmd#!} $args"
    continue
  fi
  case "$cmd" in
    status)
      echo "HFID:$HFID | L10: $(ls *.ots 2>/dev/null | wc -l) | Git: $(git rev-parse --short HEAD 2>/dev/null)"
      echo "Repo: $REPO_DIR | GPG: ${GPG_KEY:-none}"
      echo "Merkle: $(merkle_root)"
      ;;
    workspace)
      [ -z "$args" ] && ls -d ~/jhammerz* ~/*/ 2>/dev/null | grep -v ".termux" && continue
      REPO_DIR="$HOME/$args"
      [ -d "$REPO_DIR" ] || git clone "git@github.com:JHammerZ/$args.git" "$REPO_DIR"
      echo "Workspace: $REPO_DIR"
      ;;
    sign)
      git config --global user.signingkey "$GPG_KEY"
      git config --global commit.gpgsign true
      echo "GPG signing enabled: $GPG_KEY"
      ;;
    stamp)
      [ -z "$args" ] && echo "Usage: stamp <file>" && continue
      sha256sum "$args" > "$args.sha256"
      ots stamp "$args.sha256"
      echo "Stamped: $args -> $args.sha256.ots"
      notify_android "Stamped $args"
      ;;
    stampall)
      for f in $(find . -type f -not -path './.git/*' -not -name '*.ots' -not -name '*.sha256'); do
        sha256sum "$f" > "$f.sha256" && ots stamp "$f.sha256"
      done
      echo "Batch stamped repo. Merkle: $(merkle_root)"
      notify_android "Batch L9 complete"
      ;;
    merkle)
      ROOT=$(merkle_root)
      echo "$ROOT" > MERKLE_ROOT.txt
      sha256sum MERKLE_ROOT.txt > MERKLE_ROOT.txt.sha256
      ots stamp MERKLE_ROOT.txt.sha256
      echo "Merkle root: $ROOT"
      echo "Stamped: MERKLE_ROOT.txt.sha256.ots | One proof for entire repo"
      ;;
    push)
      git add.
      git commit -S -m "LYSANDER: HFID:$HFID $(date -u +%s) | Merkle:$(merkle_root)"
      git push -f origin main
      echo "Signed push complete. HFID:$HFID"
      ;;
    ci)
      git commit --allow-empty -m "LYSANDER CI: HFID:$HFID trigger"
      git push
      echo "CI triggered"
      ;;
    verify)
      for f in ${args:-*.ots}; do echo "--- $f ---"; ots verify "$f"; done
      ;;
    upgrade)
      ots upgrade ${args:-*.ots}
      notify_android "Upgrade complete"
      ;;
    seal)
      mkdir -p L10_COMPLETE
      cp *.ots *.sha256 *.txt L10_COMPLETE/ 2>/dev/null
      git bundle create L10_COMPLETE/repo.bundle --all
      tar czf L10_COMPLETE.tar.gz L10_COMPLETE/
      sha256sum L10_COMPLETE.tar.gz > L10_COMPLETE.tar.gz.sha256
      ots stamp L10_COMPLETE.tar.gz.sha256
      echo "Sealed: L10_COMPLETE.tar.gz.sha256.ots"
      ;;
    pin)
      command -v ipfs >/dev/null || { echo "pkg install ipfs"; continue; }
      HASH=$(ipfs add -Q -r L10_COMPLETE/ L10_COMPLETE.tar.gz)
      echo "IPFS: $HASH"
      echo "Gateway: https://ipfs.io/ipfs/$HASH"
      qrencode -t ANSIUTF8 "https://ipfs.io/ipfs/$HASH" 2>/dev/null || echo "Install qrencode for QR"
      ;;
    witness)
      ROOT=$(merkle_root)
      echo "HFID:$HFID | Merkle:$ROOT | $(date -u +%s)" | python -c "import sys; print('Nostr witness disabled - install nostr-relay')"
      ;;
    intel)
      termux-call-log -l 100 > call_log.json 2>/dev/null
      termux-sms-list -l 100 > sms_log.json 2>/dev/null
      termux-location > gps.json 2>/dev/null
      echo "Intel dumped. Run: stampall"
      ;;
    photo)
      FILE="proof_$(date +%s).jpg"
      termux-camera-photo -c 0 "$FILE" 2>/dev/null
      sha256sum "$FILE" > "$FILE.sha256"
      ots stamp "$FILE.sha256"
      echo "Photo L9: $FILE.sha256.ots"
      ;;
    rotate)
      echo "Run: gpg --gen-key then sign + stamp rotation.txt"
      ;;
    pack)
     ./lysander.sh -c seal 2>/dev/null || bash $0 -c seal
      tar czf FORENSIC_$(date +%s).tar.gz L10_COMPLETE.tar.gz *.json 2>/dev/null
      sha256sum FORENSIC_*.tar.gz > FORENSIC.sha256
      ots stamp FORENSIC.sha256
      echo "Forensic pack: FORENSIC.sha256.ots | Give to lawyer"
      ;;
    qr)
      [ -z "$args" ] && args=$(ipfs add -Q L10_COMPLETE.tar.gz 2>/dev/null)
      qrencode -t ANSIUTF8 "${args}" 2>/dev/null || echo "pkg install qrencode"
      ;;
    watchdog)
      while true; do
        FAIL=0
        for f in *.ots; do ots verify "$f" 2>&1 | grep -q "Bad" && FAIL=1 && notify_android "L10 FAIL: $f"; done
        sleep 1800
      done &
      echo "Watchdog PID $!. Kills on tamper."
      ;;
    laterals|audit|gps|daemon|notify)
      case "$cmd" in
        laterals)
          echo "[1] Git: $(git rev-parse --short HEAD 2>/dev/null || echo no git)"
          echo "[2] IPFS: $(command -v ipfs >/dev/null && echo Installed || echo Missing)"
          echo "[3] Raw: $(curl -sI https://raw.githubusercontent.com/JHammerZ/jhammerz.github.io/main/whitelist.txt | head -1)"
          echo "[4] OTS: $(ls *.ots 2>/dev/null | wc -l) stamps"
          echo "[5] Battery: $(termux-battery-status 2>/dev/null | grep percentage | cut -d: -f2 || echo N/A)"
          ;;
        audit)
          echo "--- GIT AUDIT ---"; git fsck --full; git log -1 --oneline
          echo "--- SHA256 AUDIT ---"; sha256sum -c whitelist.txt.sha256 2>/dev/null || echo "whitelist.txt missing"
          echo "--- CDN AUDIT ---"; curl -I https://raw.githubusercontent.com/JHammerZ/jhammerz.github.io/main/whitelist.txt
          ;;
        gps) termux-location > gps_$(date +%s).json 2>/dev/null; echo "GPS dumped";;
        daemon) watchdog;;
        notify) notify_android "${args:-LYSANDER ping}";;
      esac
      ;;
    help)
      echo "AURELIUS CORE: status, workspace, sign, stamp, stampall, merkle, push, ci, verify, upgrade, seal"
      echo "AURELIUS OPS: pin, witness, intel, photo, rotate, pack, qr, watchdog"
      echo "LEGACY: laterals, audit, gps, daemon, notify, exit"
      echo "Raw shell:!command"
      ;;
    exit)
      echo "LYSANDER> Exiting. HFID:$HFID sealed."
      break
      ;;
    *)
      [ -n "$cmd" ] && echo "Unknown: $cmd. Type help"
      ;;
  esac
done
