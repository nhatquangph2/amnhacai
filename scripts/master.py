#!/usr/bin/env python3
"""Master nhanh một bài: chuẩn hóa độ lớn (LUFS) + chặn đỉnh (True Peak) → WAV 44.1kHz/24-bit.

Dùng bộ loudnorm 2 lượt của ffmpeg (chuẩn EBU R128) — đủ tốt để phát hành khi chưa có
master thủ công trong DAW. Đầu vào nên là WAV gốc tải từ Suno; MP3 vẫn chạy được nhưng
chất lượng bị giới hạn bởi MP3.

Ví dụ:
    python3 scripts/master.py song.wav                              # -14 LUFS, -1 dBTP
    python3 scripts/master.py song.wav --lufs -16 --out song_master.wav   # nhạc ngủ/ambient
    python3 scripts/master.py song.wav --measure                    # chỉ đo, không xuất file

Cần ffmpeg (hoặc: pip install imageio-ffmpeg).
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path


def find_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("Không tìm thấy ffmpeg. Cài ffmpeg hoặc chạy: pip install imageio-ffmpeg")


def measure(ff: str, path: Path, lufs: float, tp: float, lra: float) -> dict:
    out = subprocess.run(
        [ff, "-hide_banner", "-nostats", "-i", str(path),
         "-af", f"loudnorm=I={lufs}:TP={tp}:LRA={lra}:print_format=json", "-f", "null", "-"],
        capture_output=True, text=True,
    ).stderr
    match = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", out, re.S)
    if not match:
        sys.exit(f"Không đo được {path}:\n{out[-800:]}")
    return json.loads(match.group(0))


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("input", type=Path)
    p.add_argument("--out", type=Path, help="Mặc định: <tên>_master.wav cạnh file gốc")
    p.add_argument("--lufs", type=float, default=-14.0, help="Độ lớn mục tiêu (mặc định -14)")
    p.add_argument("--tp", type=float, default=-1.0, help="True Peak tối đa dBTP (mặc định -1)")
    p.add_argument("--lra", type=float, default=11.0, help="Loudness range mục tiêu (mặc định 11)")
    p.add_argument("--measure", action="store_true", help="Chỉ đo, không xuất file")
    args = p.parse_args()

    ff = find_ffmpeg()
    m = measure(ff, args.input, args.lufs, args.tp, args.lra)
    print(f"Đầu vào : {float(m['input_i']):6.1f} LUFS | True Peak {float(m['input_tp']):5.1f} dBTP | LRA {float(m['input_lra']):4.1f}")
    if float(m["input_tp"]) > args.tp:
        print(f"⚠️  True Peak vượt {args.tp} dBTP — có nguy cơ méo/rè trên nền tảng")
    if args.measure:
        return 0

    out = args.out or args.input.with_name(f"{args.input.stem}_master.wav")
    af = (
        f"loudnorm=I={args.lufs}:TP={args.tp}:LRA={args.lra}"
        f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
    )
    subprocess.run(
        [ff, "-hide_banner", "-loglevel", "error", "-y", "-i", str(args.input),
         "-af", af, "-ar", "44100", "-c:a", "pcm_s24le", "-map_metadata", "-1", str(out)],
        check=True,
    )
    r = measure(ff, out, args.lufs, args.tp, args.lra)
    print(f"Đầu ra  : {float(r['input_i']):6.1f} LUFS | True Peak {float(r['input_tp']):5.1f} dBTP → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
