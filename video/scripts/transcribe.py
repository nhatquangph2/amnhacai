#!/usr/bin/env python3
"""Chép lời có mốc thời gian TỪNG TỪ bằng Whisper (mlx-whisper, chạy trên GPU Apple Silicon).

    npm run whisper -- HB-002            # rồi tự chạy align
    npm run whisper -- HB-001 --from 30 --to 62   # nghe lại riêng một đoạn (Whisper ảo giác / sót lời) rồi ghép vào
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
ap.add_argument("--from", dest="t0", type=float, help="chỉ nghe lại từ giây này")
ap.add_argument("--to", dest="t1", type=float, help="… tới giây này")
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
partial = args.t0 is not None
t0 = args.t0 or 0.0
if partial:
    t1 = args.t1 if args.t1 is not None else len(audio) / 16000
    audio = audio[int(t0 * 16000) : int(t1 * 16000)]
print(f"{args.id}: {len(mono) / sr:.1f}s, {sr} Hz → 16 kHz · model {args.model}")

# Gợi ý ngữ cảnh: tên bài + vài dòng đầu giúp Whisper quen giọng/chữ, không đưa cả bài (dễ bị chép lại y nguyên).
# Nghe lại một đoạn: gợi ý bằng chính các dòng lời (theo thời gian hiện có) rơi vào đoạn đó.
if partial:
    near = [l["text"] for l in song["lines"] if t0 - 5 <= l["start"] <= t1 + 5]
    prompt = f"{song['title']}. " + " ".join(near[:8])
else:
    prompt = f"{song['title']}. " + " ".join(l["text"] for l in song["lines"][:3])

tick = time.time()
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
print(f"Xong sau {time.time() - tick:.0f}s — {len(result['segments'])} đoạn")

out = VIDEO / "transcripts" / f"{args.id}.whisper.json"
out.parent.mkdir(exist_ok=True)
segments = [
    {
        "start": round(s["start"] + t0, 2),
        "end": round(s["end"] + t0, 2),
        "text": s["text"].strip(),
        "words": [
            {"word": w["word"], "start": round(w["start"] + t0, 2), "end": round(w["end"] + t0, 2), "p": round(w.get("probability", 0), 2)}
            for w in s.get("words", [])
        ],
    }
    for s in result["segments"]
]
if partial and out.exists():
    # Ghép: bỏ các đoạn cũ nằm trong khoảng vừa nghe lại, chèn đoạn mới
    old = json.loads(out.read_text())["segments"]
    keep = [s for s in old if s["end"] <= t0 or s["start"] >= t1]
    segments = sorted(keep + segments, key=lambda s: s["start"])
    print(f"  ghép vào bản cũ: thay {len(old) - len(keep)} đoạn trong {t0:.0f}–{t1:.0f}s")
out.write_text(json.dumps({"model": args.model, "language": "vi", "segments": segments}, ensure_ascii=False, indent=1) + "\n")
print(f"✓ {out.relative_to(VIDEO)}")
