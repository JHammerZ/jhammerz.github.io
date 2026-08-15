#!/data/data/com.termux/files/usr/bin/python
import subprocess, pathlib, logging

HOME = pathlib.Path.home()
SHORTS_DIR = HOME / 'shorts'
THUMBS_DIR = HOME / 'thumbs'
THUMBS_DIR.mkdir(exist_ok=True)

logging.basicConfig(level=logging.INFO, format='%(levelname)s - %(message)s')

def get_duration(video):
    try:
        cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', 
               '-of', 'default=noprint_wrappers=1:nokey=1', str(video)]
        result = subprocess.check_output(cmd, stderr=subprocess.DEVNULL).decode().strip()
        return float(result) if result != 'N/A' and result else None
    except:
        return None

def extract_thumb(video, time_sec, out_path):
    vf = "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2"
    cmd = [
        'ffmpeg', '-y', '-ss', str(time_sec), '-i', str(video),
        '-vframes', '1', '-vf', vf, '-q:v', '2', str(out_path)
    ]
    return subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL).returncode == 0

def main():
    videos = sorted(list(SHORTS_DIR.glob('*.mp4')))
    if not videos:
        raise SystemExit(f"No MP4s found in {SHORTS_DIR}")
    
    logging.info(f"Found {len(videos)} Shorts. Generating 3 thumbs each.")
    total_thumbs = 0
    skipped = 0
    
    for video in videos:
        duration = get_duration(video)
        if not duration or duration < 1:
            logging.warning(f"Skipping {video.name}: no valid duration")
            skipped += 1
            continue
        
        times = [duration * 0.1, duration * 0.5, duration * 0.9]
        
        for i, t in enumerate(times, 1):
            thumb_name = f"{video.stem}_thumb_{i}.jpg"
            thumb_path = THUMBS_DIR / thumb_name
            if extract_thumb(video, t, thumb_path):
                total_thumbs += 1
    
    logging.info(f"DONE. Generated {total_thumbs} thumbnails. Skipped {skipped} corrupted files in {THUMBS_DIR}")

if __name__ == '__main__':
    main()
