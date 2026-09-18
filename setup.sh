pkg update -y && pkg install -y python ffmpeg termux-api
pip install --upgrade pip
pip install opencv-python mediapipe numpy sounddevice
mkdir -p ~/morph/{models,logs}
echo "Setup done. Camera + mic permission needed."
termux-setup-storage
