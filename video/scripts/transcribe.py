#!/usr/bin/env python3
"""Chép lời có mốc thời gian TỪNG TỪ bằng Whisper (mlx-whisper, chạy trên GPU Apple Silicon).

    npm run whisper -- HB-002            # rồi tự chạy align
    .venv/bin/python scripts/transcribe.py HB-002 --model mlx-community/whisper-large-v3-mlx

Đọc audio của bài (public/HB-xxx/audio.*) bằng soundfile → không cần ffmpeg.
Kết quả: transcripts/HB-xxx.whisper.json (định dạng segments/words chuẩn của whisper).
"""
import argparse
import json
import sys
import time
from math import gcd
from pathlib import Path

import mlx_whisper
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

VIDEO = Path(__file__).resolve().parent.parent

ap = argparse.ArgumentParser()
ap.add_argument("id")
ap.add_argument("--model", default="mlx-community/whisper-large-v3-turbo")
args = ap.parse_args()

song_file = VIDEO / "src" / "songs" / f"{args.id}.json"
if not song_file.exists():
    sys.exit(f"Không thấy {song_file} — chạy npm run prep trước")
song = json.loads(song_file.read_text())
audio_path = VIDEO / "public" / song["audio"]
if not song["audio"] or not audio_path.exists():
    sys.exit(f"Chưa có audio — npm run prep -- {args.id} --audio <file>")

# Whisper cần mono 16 kHz float32
data, sr = sf.read(audio_path, dtype="float32", always_2d=True)
mono = data.mean(axis=1)
g = gcd(sr, 16000)
audio = resample_poly(mono, 16000 // g, sr // g).astype(np.float32)
print(f"{args.id}: {len(mono) / sr:.1f}s, {sr} Hz → 16 kHz · model {args.model}")

# Gợi ý ngữ cảnh: tên bài + vài dòng đầu giúp Whisper quen giọng/chữ, không đưa cả bài (dễ bị chép lại y nguyên)
prompt = f"{song['title']}. " + " ".join(l["text"] for l in song["lines"][:3])

t0 = time.time()
result = mlx_whisper.transcribe(
    audio,
    path_or_hf_repo=args.model,
    language="vi",
    word_timestamps=True,
    initial_prompt=prompt,
    condition_on_previous_text=False,  # tránh lặp vô tận khi gặp đoạn nhạc dạo
    no_speech_threshold=0.5,
    verbose=False,
)
print(f"Xong sau {time.time() - t0:.0f}s — {len(result['segments'])} đoạn")

out = VIDEO / "transcripts" / f"{args.id}.whisper.json"
out.parent.mkdir(exist_ok=True)
segments = [
    {
        "start": round(s["start"], 2),
        "end": round(s["end"], 2),
        "text": s["text"].strip(),
        "words": [
            {"word": w["word"], "start": round(w["start"], 2), "end": round(w["end"], 2), "p": round(w.get("probability", 0), 2)}
            for w in s.get("words", [])
        ],
    }
    for s in result["segments"]
]
out.write_text(json.dumps({"model": args.model, "language": "vi", "segments": segments}, ensure_ascii=False, indent=1) + "\n")
print(f"✓ {out.relative_to(VIDEO)}")
