#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
REPO_DIR="$HOME/jhammerz.github.io/guitaraoke"

echo "[1/6] Termux Packages"
pkg update -y
pkg install -y git ffmpeg python python-numpy cmake ninja wget jq termux-api

echo "[2/6] Python pip upgrade"
pip install --upgrade pip

echo "[3/6] Python deps - no compile"
pip install --no-cache-dir --no-deps -r "$REPO_DIR/scripts/requirements.txt"

echo "[4/6] whisper.cpp"
cd ~ && [ -d whisper.cpp ] || git clone https://github.com/ggerganov/whisper.cpp.git
cd ~/whisper.cpp && cmake -B build -DGGML_OPENMP=ON && cmake --build build -j
bash./models/download-ggml-model.sh base

echo "[5/6] Test whisper"
./build/bin/whisper-cli -h | head -n 1

echo "[6/6] Done"
echo "Run: python ~/jhammerz.github.io/guitaraoke/scripts/core/guitaraoke_cpp.py"
