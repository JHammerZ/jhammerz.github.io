#!/data/data/com.termux/files/usr/bin/bash
cd "$HOME/sovereign_node"
if [ -z "$LYSANDER_SECRET_SEED" ]; then
    export LYSANDER_SECRET_SEED=$(openssl rand -hex 32)
fi
python sovereign_proxy.py
