#!/data/data/com.termux/files/usr/bin/python
import json, subprocess, pathlib, logging, math, os

HOME = pathlib.Path.home()
VIDEO_DIR = pathlib.Path('/storage/emulated/0/DCIM/Camera')
VIDEOS = list(VIDEO_DIR.glob('*Guitaraoke*.mp4'))
if not VIDEOS:
    raise SystemExit("No Guitaraoke*.mp4 found in DCIM/Camera")
VIDEO = VIDEOS[0]
JSON_PATH = HOME / 'temp_audio.json'
OUT_DIR = HOME / 'shorts'
OUT_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

def get_duration(video):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', str(video)]
    return float(subprocess.check_output(cmd).decode().strip())

def find_hooks(transcription):
    segments = []
    for seg in transcription:
        start = seg['offsets']['from'] / 1000.0
        end = seg['offsets']['to'] / 1000.0
        if not 8 < end - start < 45: continue
        text = seg['text'].strip()
        word_count = len(text.split())
        if word_count < 5: continue
        density = word_count / (end - start)
        score = density * math.log(end - start + 1)
        segments.append({'start': start, 'end': end, 'text': text, 'score': score})
    segments.sort(key=lambda x: x['score'], reverse=True)
    return segments[:6]

def make_vertical_crop(video, start, end, out_path, text):
    safe_text = text.replace("'", "").replace('"', '').replace(':', '\\:')[:60]
    vf = f"crop=ih*9/16:ih,scale=1080:1920,drawtext=text='{safe_text}':fontcolor=white:fontsize=60:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=h-200"
    cmd = ['ffmpeg', '-y', '-ss', str(start), '-to', str(end), '-i', str(video), '-vf', vf, '-c:a', 'aac', '-b:a', '128k', str(out_path)]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    logging.info(f"Loading {JSON_PATH}")
    if not JSON_PATH.exists():
        raise SystemExit(f"Run whisper first: cd ~/whisper.cpp &&./build/bin/whisper-cli -m models/ggml-base.bin -f ~/temp_audio.wav -ojf -of {JSON_PATH}")
    data = json.loads(JSON_PATH.read_text())
    transcription = data['transcription']
    hooks = find_hooks(transcription)
    logging.info(f"Found {len(hooks)} potential Shorts from {VIDEO.name}")
    for i, hook in enumerate(hooks, 1):
        out_file = OUT_DIR / f"short_{i:02d}_{int(hook['start'])}s.mp4"
        logging.info(f"Cutting Short {i}: {hook['start']:.1f}s-{hook['end']:.1f}s")
        make_vertical_crop(VIDEO, hook['start'], hook['end'], out_file, hook['text'])
        logging.info(f"Saved: {out_file}")
    logging.info(f"DONE. Check {OUT_DIR}")

if __name__ == '__main__':
    main()
