#!/usr/bin/env python3
"""Cắt MV 16:9 thành Shorts dọc 1080×1920 (YouTube Shorts · TikTok · Reels · Facebook Reels).

Bố cục: câu hook lớn ở trên · khung MV (giữ phụ đề karaoke in sẵn) ở giữa · tên bài + lời kêu gọi ở dưới.
Danh sách clip nằm trong releases/<bài>/shorts.json.

    python3 scripts/make_shorts.py releases/HB-001_tang-da/shorts.json --mv "~/Downloads/Câu chuyện tảng đá_Senore.mp4"
    python3 scripts/make_shorts.py releases/HB-002_sau-mua-giong/shorts.json --mv ~/Downloads/HB-002_anim.mp4 --only 1

Cần ffmpeg (hoặc: pip install imageio-ffmpeg) và Pillow.
"""
import argparse
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "brand" / "fonts"
W, H = 1080, 1920
BG = (14, 13, 13)
PAPER = (239, 232, 220)
EMBER = (217, 98, 43)
MUTED = (150, 144, 136)

# Vùng hình của MV (bỏ dải đen điện ảnh trên/dưới), cắt giữa để phụ đề karaoke vẫn đọc được
CROP = dict(x=240, y=138, w=1440, h=812)
PANEL_Y = 520


def find_ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        sys.exit("Không tìm thấy ffmpeg. Cài ffmpeg hoặc chạy: pip install imageio-ffmpeg")


def font(name, size, weight=None):
    f = ImageFont.truetype(str(FONTS / name), size)
    if weight:
        try:
            f.set_variation_by_name(weight)
        except Exception:
            pass
    return f


def wrap(draw, text, fnt, max_w):
    lines = []
    for para in text.split("\n"):
        cur = ""
        for word in para.split():
            test = f"{cur} {word}".strip()
            if draw.textlength(test, font=fnt) <= max_w or not cur:
                cur = test
            else:
                lines.append(cur)
                cur = word
        lines.append(cur)
    return lines


def overlay(hook, title, artist, cta, panel_h, out):
    """Ảnh PNG trong suốt phủ lên toàn khung: hook, tên bài, lời kêu gọi."""
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # Hook: canh giữa khoảng trống phía trên khung MV
    size = 78
    while True:
        f_hook = font("Lora[wght].ttf", size, "SemiBold")
        lines = wrap(d, hook, f_hook, W - 140)
        lh = int(size * 1.3)
        if len(lines) * lh <= PANEL_Y - 170 or size <= 50:
            break
        size -= 4
    y = (PANEL_Y - len(lines) * lh) // 2 + 20
    for ln in lines:
        d.text((W / 2, y), ln, font=f_hook, fill=PAPER, anchor="ma")
        y += lh

    # Dưới khung MV: nghệ sĩ · tên bài · lời kêu gọi
    y = PANEL_Y + panel_h + 70
    f_art = font("BeVietnamPro-Medium.ttf", 40)
    d.text((W / 2, y), " ".join(artist.lower()), font=f_art, fill=EMBER, anchor="ma")
    d.line([(W / 2 - 50, y + 70), (W / 2 + 50, y + 70)], fill=EMBER, width=4)
    f_title = font("Lora[wght].ttf", 76, "SemiBold")
    d.text((W / 2, y + 100), title.upper(), font=f_title, fill=PAPER, anchor="ma")
    f_cta = font("BeVietnamPro-Medium.ttf", 38)
    d.text((W / 2, y + 230), cta, font=f_cta, fill=MUTED, anchor="ma")
    img.save(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("spec", type=Path)
    ap.add_argument("--mv", required=True, type=Path, help="File MV 1920×1080")
    ap.add_argument("--only", type=int, nargs="*", help="Chỉ dựng các clip số …")
    args = ap.parse_args()

    spec = json.loads(args.spec.read_text(encoding="utf-8"))
    mv = args.mv.expanduser()
    out_dir = args.spec.parent / "shorts"
    out_dir.mkdir(exist_ok=True)
    ff = find_ffmpeg()
    panel_w = W
    panel_h = round(CROP["h"] * panel_w / CROP["w"])

    for i, clip in enumerate(spec["clips"], 1):
        if args.only and i not in args.only:
            continue
        start, end = clip["start"], clip["end"]
        dur = end - start
        if dur > 60:
            sys.exit(f"Clip {i} dài {dur:.1f}s — Shorts tối đa 60s")
        name = f"{spec['id']}_short-{i:02d}_{clip['slug']}.mp4"
        with tempfile.TemporaryDirectory() as tmp:
            ov = Path(tmp) / "ov.png"
            overlay(clip["hook"], spec["title"], spec["artist"], spec.get("cta", "Nghe bản đầy đủ trên kênh"), panel_h, ov)
            fade_out = max(dur - 1.2, 0)
            fc = (
                f"color=c=0x{BG[0]:02x}{BG[1]:02x}{BG[2]:02x}:s={W}x{H}:r=30:d={dur:.3f}[bg];"
                f"[0:v]crop={CROP['w']}:{CROP['h']}:{CROP['x']}:{CROP['y']},scale={panel_w}:{panel_h}:flags=lanczos,"
                f"setsar=1[mv];"
                f"[bg][mv]overlay=0:{PANEL_Y}:shortest=1[b1];"
                f"[b1][1:v]overlay=0:0,fade=t=in:st=0:d=0.4,fade=t=out:st={fade_out:.3f}:d=1.2,format=yuv420p[v];"
                f"[0:a]afade=t=in:st=0:d=0.3,afade=t=out:st={fade_out:.3f}:d=1.2[a]"
            )
            cmd = [ff, "-hide_banner", "-loglevel", "error", "-y",
                   "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(mv),
                   "-loop", "1", "-t", f"{dur:.3f}", "-i", str(ov),
                   "-filter_complex", fc, "-map", "[v]", "-map", "[a]",
                   "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-r", "30",
                   "-c:a", "aac", "-b:a", "256k", "-ar", "48000",
                   "-movflags", "+faststart", str(out_dir / name)]
            subprocess.run(cmd, check=True)
        print(f"✓ {out_dir / name} ({dur:.1f}s) — {clip['hook'][:50]}")


if __name__ == "__main__":
    main()
