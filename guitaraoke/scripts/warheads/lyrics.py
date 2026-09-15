#!/data/data/com.termux/files/usr/bin/python
import json, pathlib

HOME = pathlib.Path.home()
JSON_PATH = HOME / 'temp_audio.json'
ASS_PATH = HOME / 'lyrics.ass'

ASS_HEADER = """[Script Info]
Title: GuitarAOKE
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,80,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,3,2,2,10,10,50,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

def ms_to_ass_time(ms):
    s = ms / 1000.0
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    sec = int(s % 60)
    cs = int((s - int(s)) * 100)
    return f"{h}:{m:02d}:{sec:02d}.{cs:02d}"

def main():
    data = json.loads(JSON_PATH.read_text())
    lines = [ASS_HEADER]
    for seg in data['transcription']:
        start = ms_to_ass_time(seg['offsets']['from'])
        end = ms_to_ass_time(seg['offsets']['to'])
        text = seg['text'].strip().replace('\n', ' ')
        lines.append(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}")
    ASS_PATH.write_text('\n'.join(lines))
    print(f"ASS file saved: {ASS_PATH}")
    print(f"Test: mpv /storage/emulated/0/DCIM/Camera/Guitaraoke_TT_001.mp4 --sub-file={ASS_PATH}")

if __name__ == '__main__':
    main()
