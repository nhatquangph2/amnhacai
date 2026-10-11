#!/usr/bin/env python3
"""Thumbnail MV 1280×720 kiểu poster: nền cảnh MV (mờ chiều sâu) + nhân vật render sắc nét từ code MV
(PNG trong suốt) + khối tên bài Be Vietnam Pro Black. Nguyên tắc: docs/12-thumbnail-banner.md

    python3 scripts/make_thumbnail.py --bg bg.png --bg-box 0,0,1387,780 --char char.png \
        --title "ĐỪNG|OÁN TRÁCH|THÊM CHI" --out releases/HB-006.../thumbnails/HB-006_thumb.jpg

--title: các dòng cách nhau bằng "|"; dòng dài nhất được phóng to nhất (khối chữ cùng bề rộng kiểu poster).
"""
import argparse
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageEnhance, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "brand" / "fonts"
W, H, M = 1280, 720, 72
CREAM = (255, 246, 222)
EMBER = (232, 132, 72)
EMBER_DARK = (176, 74, 30)


def bvp(weight, size):
    return ImageFont.truetype(str(FONTS / f"BeVietnamPro-{weight}.ttf"), size)


def fit_line(text, width, weight="Black"):
    """Cỡ chữ để dòng vừa đúng `width` (căn hai lề khối chữ)."""
    lo, hi = 10, 400
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if bvp(weight, mid).getlength(text) <= width:
            lo = mid
        else:
            hi = mid - 1
    return lo


def glow_layer(size, cx, cy, r, col, a):
    layer = Image.new("RGB", size, (0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=tuple(int(c * a) for c in col))
    return layer.filter(ImageFilter.GaussianBlur(r * 0.6))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bg", required=True)
    ap.add_argument("--bg-box", required=True, help="x,y,w,h vùng cắt nền (16:9) trên khung gốc")
    ap.add_argument("--char", help="PNG nền trong suốt (bỏ trống nếu nhân vật đã có sẵn trong nền)")
    ap.add_argument("--char-h", type=int, default=760, help="chiều cao nhân vật trên khung 1280×720")
    ap.add_argument("--char-x", type=int, default=-120)
    ap.add_argument("--char-y", type=int, default=40)
    ap.add_argument("--title", required=True)
    ap.add_argument("--artist", default="SENORE MUSIC")
    ap.add_argument("--block-w", type=int, default=560, help="bề rộng khối chữ")
    ap.add_argument("--block-x", type=int, default=None, help="mép trái khối chữ (mặc định: căn phải theo lề)")
    ap.add_argument("--block-y", type=int, default=None, help="mép trên khối chữ (mặc định: giữa khung)")
    ap.add_argument("--ink", default="255,246,222", help="màu chữ tên bài — lấy từ ánh sáng của cảnh")
    ap.add_argument("--scrim", type=int, default=150, help="độ tối nền mềm sau khối chữ (0 = không)")
    ap.add_argument("--blur", type=float, default=3.2, help="độ mờ nền (chiều sâu)")
    ap.add_argument("--warm-glow", type=float, default=0, help="làm các vùng màu cam trong nền (vd. rễ cây) sáng lên")
    ap.add_argument("--glow", default="190,225,110", help="màu quầng sáng nguồn sáng của nhân vật (đèn bụng, đèn lồng)")
    ap.add_argument("--glow-k", type=float, default=1.0, help="độ mạnh quầng sáng (0 = tắt)")
    ap.add_argument("--out", required=True)
    a = ap.parse_args()

    # Nền: cắt vùng sạch, mờ nhẹ cho chiều sâu, tối dần về phía khối chữ
    x, y, w, h = map(int, a.bg_box.split(","))
    bg = Image.open(a.bg).convert("RGB").crop((x, y, x + w, y + h)).resize((W, H), Image.LANCZOS)
    bg = bg.filter(ImageFilter.GaussianBlur(a.blur)) if a.blur else bg
    bg = ImageEnhance.Color(bg).enhance(1.25)
    bg = ImageEnhance.Brightness(bg).enhance(0.92)
    if a.warm_glow:
        r0, g0, b0 = bg.split()
        warm = ImageChops.subtract(r0, b0).point(lambda v: min(255, max(0, (v - 12) * 6)))
        lift = Image.new("RGB", (W, H), (0, 0, 0))
        lift.paste((255, 140, 60), (0, 0), warm.point(lambda v: int(v * 0.55 * a.warm_glow)))
        halo = Image.new("RGB", (W, H), (0, 0, 0))
        halo.paste((255, 120, 40), (0, 0), warm.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * 0.5 * a.warm_glow)))
        bg = ImageChops.add(ImageChops.add(bg, lift), halo)

    # Nhân vật + quầng sáng đèn bụng hắt ra cảnh
    ch = None
    if a.char:
        ch = Image.open(a.char).convert("RGBA")
        box = ch.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()  # bỏ quầng mờ quanh nhân vật
        ch = ch.crop((max(box[0] - 120, 0), box[1], min(box[2] + 40, ch.width), box[3]))
        # bỏ quầng mờ có sẵn trong render (bị cắt cụt thành mép cứng) — quầng sáng vẽ lại bên dưới
        ch.putalpha(ch.split()[3].point(lambda v: 0 if v < 8 else v))
        ch = ch.resize((int(ch.width * a.char_h / ch.height), a.char_h), Image.LANCZOS)
        # tâm đèn bụng = vùng sáng nhất của nhân vật → quầng sáng hắt ra cảnh & lên chữ
        r, g, b, al = ch.split()
        # vàng (đèn), không lấy lòng trắng mắt hay lông ngựa trắng
        lum = ImageChops.multiply(ImageChops.multiply(r.point(lambda v: 255 if v > 220 else 0), g.point(lambda v: 255 if v > 200 else 0)), b.point(lambda v: 255 if v < 175 else 0))
        lum = ImageChops.multiply(lum, al.point(lambda v: 255 if v > 200 else 0))
        # chỗ dày đặc nhất (đèn bụng), không phải các nét viền sáng mảnh
        dens = lum.filter(ImageFilter.BoxBlur(25))
        peak = dens.getextrema()[1]
        lb = dens.point(lambda v: 255 if v >= peak * 0.9 else 0).getbbox()
        gx, gy = a.char_x + (lb[0] + lb[2]) // 2, a.char_y + (lb[1] + lb[3]) // 2
        gc = tuple(int(c) for c in a.glow.split(","))
        bg = ImageChops.add(bg, glow_layer((W, H), gx, gy, 420, gc, 0.6 * a.glow_k))
        bg = ImageChops.add(bg, glow_layer((W, H), gx, gy, 180, (255, 245, 170), 0.75 * a.glow_k))


    # Khối tên bài
    lines = a.title.split("|")
    bw = a.block_w
    bx = a.block_x if a.block_x is not None else W - M - bw
    sizes = [fit_line(ln, bw) for ln in lines]
    # dòng ngắn (vd. "ĐỪNG") không phóng to hơn dòng dài nhất → giữ chủ–phụ
    main_s = sizes[max(range(len(lines)), key=lambda i: len(lines[i]))]
    sizes = [min(s, int(main_s * 0.62)) if len(ln) <= 5 else s for s, ln in zip(sizes, lines)]
    art_f = bvp("SemiBold", 26)
    gap = 0.16
    heights = [int(s * (1.0 + gap)) for s in sizes]
    total = 40 + sum(heights)
    ty = a.block_y if a.block_y is not None else (H - total) // 2 - 10
    ink = tuple(int(c) for c in a.ink.split(","))
    dark_ink = sum(ink) < 384

    text = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(text)
    # tên nghệ sĩ: chữ nhỏ giãn 0.12em, màu Ember
    spaced = " ".join(a.artist)
    d.text((bx, ty), spaced, font=art_f, fill=(EMBER_DARK if dark_ink else EMBER) + (255,))
    yy = ty + 40
    for ln, s in zip(lines, sizes):
        f = bvp("Black", s)
        tw = f.getlength(ln)
        d.text((bx + (bw - tw) / 2, yy), ln, font=f, fill=ink + (255,))
        yy += int(s * (1.0 + gap))

    # nền tối mềm sau khối chữ + bóng chữ mềm (không viền dày)
    scrim = Image.new("L", (W, H), 0)
    ImageDraw.Draw(scrim).rounded_rectangle([bx - 60, ty - 50, bx + bw + 60, yy + 30], 80, fill=a.scrim)
    scrim = scrim.filter(ImageFilter.GaussianBlur(70))
    bg = Image.composite(Image.new("RGB", (W, H), (6, 8, 22)), bg, scrim)
    shadow = text.split()[3].filter(ImageFilter.GaussianBlur(9))
    if dark_ink:  # chữ tối trên trời sáng: chỉ một quầng sáng nhẹ tách chữ khỏi nền
        bg.paste((255, 236, 214), (0, 0), shadow.point(lambda v: int(v * 0.35)))
    else:
        bg.paste((0, 0, 0), (0, 4), shadow.point(lambda v: int(v * 0.75)))
        # chữ "được chiếu sáng": quầng kem mềm quanh chữ
        bloom = Image.new("RGB", (W, H), (0, 0, 0))
        bloom.paste((255, 226, 150), (0, 0), text.split()[3].filter(ImageFilter.GaussianBlur(22)).point(lambda v: int(v * 0.33)))
        bg = ImageChops.add(bg, bloom)
    bg.paste(text, (0, 0), text)

    if ch is not None:
        bg.paste(ch, (a.char_x, a.char_y), ch)
        # đèn bụng "tự sáng rực": quầng sáng phủ lên trên nhân vật
        bg = ImageChops.screen(bg, glow_layer((W, H), gx, gy, 95, (255, 250, 190), 0.85 * a.glow_k))
    out = Path(a.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    bg.save(out, quality=94)
    print("✓", out)


if __name__ == "__main__":
    main()
