#!/usr/bin/env python3
"""Dựng video mix dài cho YouTube từ một thư mục audio + sinh chapters (timestamps).

Bài được sắp theo tên file — đặt tiền tố số để sắp thứ tự: 01_mua-tren-hien.wav, 02_...
Tên chapter lấy từ tên file (bỏ tiền tố số / mã HB-xxx / hậu tố _master),
hoặc từ file --titles (mỗi dòng một tên, theo đúng thứ tự file).

Ví dụ:
    # Chỉ sinh chapters.txt (dán vào mô tả YouTube)
    python3 scripts/build_mix.py releases/mix-001/audio --chapters-only

    # Render video từ ảnh tĩnh, crossfade 8 giây, lặp cả danh sách 2 lần
    python3 scripts/build_mix.py releases/mix-001/audio --image bg.jpg --crossfade 8 --repeat 2 \\
        --out releases/mix-001/mix-001.mp4

    # Render từ video loop ngắn (mưa rơi, khói trà...)
    python3 scripts/build_mix.py releases/mix-001/audio --loop-video rain-loop.mp4 --out mix.mp4

Yêu cầu: ffmpeg + ffprobe để render (và để đọc độ dài file không phải WAV).
"""

import argparse
import json
import re
import shutil
import subprocess
import sys
import wave
from pathlib import Path

AUDIO_EXT = {".wav", ".mp3", ".flac", ".m4a", ".aac", ".ogg"}


def duration_of(path: Path) -> float:
    if path.suffix.lower() == ".wav":
        try:
            with wave.open(str(path)) as w:
                return w.getnframes() / float(w.getframerate())
        except wave.Error:
            pass  # WAV 24-bit/float có thể không đọc được bằng module wave → dùng ffprobe
    if not shutil.which("ffprobe"):
        sys.exit(f"Cần ffprobe để đọc độ dài {path.name}. Cài ffmpeg: https://ffmpeg.org/download.html")
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(path)],
        check=True, capture_output=True, text=True,
    ).stdout
    return float(json.loads(out)["format"]["duration"])


def title_from_filename(path: Path) -> str:
    name = path.stem
    name = re.sub(r"^\d+[\s._-]+", "", name)             # 01_...
    name = re.sub(r"^HB-\d+[\s._-]*", "", name)           # HB-012_...
    name = re.sub(r"[\s._-]*(master|final|mix)$", "", name, flags=re.I)
    name = re.sub(r"[_-]+", " ", name).strip()
    return name[:1].upper() + name[1:] if name else path.stem


def fmt_time(seconds: float, with_hours: bool) -> str:
    s = int(seconds)
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    return f"{h}:{m:02d}:{sec:02d}" if with_hours else f"{m:02d}:{sec:02d}"


def build_chapters(titles: list[str], durations: list[float], crossfade: float) -> tuple[list[str], float]:
    starts, t = [], 0.0
    for i, d in enumerate(durations):
        starts.append(t)
        t += d - (crossfade if i < len(durations) - 1 else 0)
    total = t
    with_hours = total >= 3600
    lines = [f"{fmt_time(s, with_hours)} {title}" for s, title in zip(starts, titles)]
    return lines, total


def check_youtube_chapters(durations: list[float], crossfade: float) -> list[str]:
    warnings = []
    if len(durations) < 3:
        warnings.append("YouTube cần ≥ 3 chapters để hiển thị Key moments.")
    if any(d - crossfade < 10 for d in durations):
        warnings.append("Mỗi chapter trên YouTube phải dài ≥ 10 giây.")
    return warnings


def render(files: list[Path], out: Path, crossfade: float, image: Path | None,
           loop_video: Path | None, fade_out: float, total: float) -> None:
    if not shutil.which("ffmpeg"):
        sys.exit("Không tìm thấy ffmpeg. Cài đặt: https://ffmpeg.org/download.html")

    cmd = ["ffmpeg", "-y", "-hide_banner"]
    for f in files:
        cmd += ["-i", str(f)]

    n = len(files)
    filters = []
    for i in range(n):
        filters.append(f"[{i}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=stereo[a{i}]")
    if n == 1:
        last = "a0"
    elif crossfade > 0:
        prev = "a0"
        for i in range(1, n):
            label = f"x{i}"
            filters.append(f"[{prev}][a{i}]acrossfade=d={crossfade}:c1=tri:c2=tri[{label}]")
            prev = label
        last = prev
    else:
        filters.append("".join(f"[a{i}]" for i in range(n)) + f"concat=n={n}:v=0:a=1[cat]")
        last = "cat"
    if fade_out > 0:
        filters.append(f"[{last}]afade=t=out:st={max(total - fade_out, 0):.3f}:d={fade_out}[aout]")
        last = "aout"

    if image or loop_video:
        vin = n
        if image:
            cmd += ["-loop", "1", "-framerate", "1", "-i", str(image)]
            vcodec = ["-c:v", "libx264", "-tune", "stillimage", "-preset", "medium", "-crf", "20", "-r", "1"]
        else:
            cmd += ["-stream_loop", "-1", "-i", str(loop_video)]
            vcodec = ["-c:v", "libx264", "-preset", "medium", "-crf", "20"]
        filters.append(
            f"[{vin}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p[vout]"
        )
        cmd += ["-filter_complex", ";".join(filters), "-map", "[vout]", "-map", f"[{last}]"]
        cmd += vcodec + ["-c:a", "aac", "-b:a", "320k", "-t", f"{total:.3f}", "-movflags", "+faststart", str(out)]
    else:
        cmd += ["-filter_complex", ";".join(filters), "-map", f"[{last}]"]
        codec = ["-c:a", "pcm_s24le"] if out.suffix.lower() == ".wav" else ["-c:a", "libmp3lame", "-b:a", "320k"]
        cmd += codec + [str(out)]

    print("▶ Đang render (video dài có thể mất vài phút)...")
    subprocess.run(cmd, check=True)
    print(f"✅ Xong: {out}")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("audio_dir", type=Path, help="Thư mục chứa các file audio của mix")
    p.add_argument("--titles", type=Path, help="File tên bài, mỗi dòng một tên (theo thứ tự file)")
    p.add_argument("--crossfade", type=float, default=0.0, help="Số giây crossfade giữa các bài (vd: 5–15)")
    p.add_argument("--repeat", type=int, default=1, help="Lặp lại cả danh sách N lần (kéo dài video)")
    p.add_argument("--fade-out", type=float, default=10.0, help="Fade-out cuối mix (giây)")
    src = p.add_mutually_exclusive_group()
    src.add_argument("--image", type=Path, help="Ảnh nền tĩnh cho video")
    src.add_argument("--loop-video", type=Path, help="Video loop ngắn làm nền")
    p.add_argument("--out", type=Path, help="File đầu ra (.mp4 cho video, .wav/.mp3 cho audio)")
    p.add_argument("--chapters-only", action="store_true", help="Chỉ sinh chapters, không render")
    args = p.parse_args()

    files = sorted(f for f in args.audio_dir.iterdir() if f.suffix.lower() in AUDIO_EXT)
    if not files:
        sys.exit(f"Không có file audio trong {args.audio_dir}")

    if args.titles:
        titles = [l.strip() for l in args.titles.read_text(encoding="utf-8").splitlines() if l.strip()]
        if len(titles) != len(files):
            sys.exit(f"--titles có {len(titles)} dòng nhưng thư mục có {len(files)} file audio")
    else:
        titles = [title_from_filename(f) for f in files]

    durations = [duration_of(f) for f in files]
    if args.crossfade and any(d <= args.crossfade * 2 for d in durations):
        sys.exit("Crossfade quá dài so với độ dài một số bài")

    files, titles, durations = files * args.repeat, titles * args.repeat, durations * args.repeat
    chapters, total = build_chapters(titles, durations, args.crossfade)

    chapters_path = (args.out.parent if args.out else args.audio_dir.parent) / "chapters.txt"
    chapters_path.parent.mkdir(parents=True, exist_ok=True)
    chapters_path.write_text("\n".join(chapters) + "\n", encoding="utf-8")

    print("\n".join(chapters))
    print(f"\nTổng thời lượng: {fmt_time(total, True)}  •  {len(files)} bài  •  chapters → {chapters_path}")
    for w in check_youtube_chapters(durations, args.crossfade):
        print(f"⚠️  {w}")

    if args.chapters_only:
        return 0
    if not args.out:
        sys.exit("Cần --out để render (hoặc dùng --chapters-only)")
    args.out.parent.mkdir(parents=True, exist_ok=True)
    render(files, args.out, args.crossfade, args.image, args.loop_video, args.fade_out, total)
    return 0


if __name__ == "__main__":
    sys.exit(main())
