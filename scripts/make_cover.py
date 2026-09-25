#!/usr/bin/env python3
"""Vẽ ảnh bìa 3000×3000 "cây đơn độc sau bão" theo bộ nhận diện Senore (docs/02).

    python3 scripts/make_cover.py --title "Sau Mùa Giông" --out releases/HB-002_sau-mua-giong/cover.png
    python3 scripts/make_cover.py --title "Tảng Đá" --seed 7 --out releases/HB-001_tang-da/cover.png

Cùng khung, cùng vị trí chữ ở mọi bài; đổi --seed để có dáng cây khác.
"""
import argparse
import math
import random
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "brand" / "fonts"

# Bảng màu "Giấy cũ & Mực"
PAPER = (239, 232, 220)
INK = (30, 30, 30)
STONE = (58, 58, 60)
EMBER = (217, 98, 43)
NIGHT = (35, 48, 74)
EARTH = (122, 92, 67)

S = 3000


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(img, horizon):
    """Trời giông tan dần: xanh đêm → đá xám → ánh lửa bình minh ở chân trời."""
    d = ImageDraw.Draw(img)
    for y in range(S):
        t = min(y / horizon, 1.0)
        if t < 0.55:
            c = lerp(NIGHT, STONE, t / 0.55)
        else:
            c = lerp(STONE, EMBER, ((t - 0.55) / 0.45) ** 1.6)
        d.line([(0, y), (S, y)], fill=c)


def glow(img, cx, cy, r):
    """Quầng sáng mặt trời vừa ló sau mây."""
    layer = Image.new("RGB", img.size, (0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=(150, 70, 30))
    layer = layer.filter(ImageFilter.GaussianBlur(r * 0.6))
    return ImageChops.add(img, layer)


def clouds(img, rng, horizon):
    """Dải mây giông tối, loãng dần về phía chân trời."""
    layer = Image.new("L", img.size, 0)
    d = ImageDraw.Draw(layer)
    for _ in range(90):
        y = rng.uniform(0, horizon * 0.8)
        w = rng.uniform(500, 1500)
        h = rng.uniform(60, 180)
        x = rng.uniform(-300, S)
        a = int(170 * (1 - y / (horizon * 0.8)) ** 1.3)
        d.ellipse([x, y, x + w, y + h], fill=a)
    layer = layer.filter(ImageFilter.GaussianBlur(60))
    dark = Image.new("RGB", img.size, (22, 26, 36))
    return Image.composite(dark, img, layer)


def hill_y(x, base):
    return base - 220 * math.exp(-(((x - S * 0.5) / (S * 0.32)) ** 2))


def ground(img, base):
    d = ImageDraw.Draw(img)
    pts = [(x, hill_y(x, base)) for x in range(0, S + 1, 10)] + [(S, S), (0, S)]
    d.polygon(pts, fill=(26, 24, 24))


def branch(d, rng, x, y, ang, length, width, depth, color, up=True):
    """Cành/rễ đệ quy. up=False → rễ đi xuống."""
    if depth == 0 or length < 12:
        return
    x2 = x + math.cos(ang) * length
    y2 = y - math.sin(ang) * length if up else y + math.sin(ang) * length
    d.line([(x, y), (x2, y2)], fill=color, width=max(1, int(width)))
    d.ellipse([x2 - width / 2, y2 - width / 2, x2 + width / 2, y2 + width / 2], fill=color)
    n = 2 if depth > 2 else rng.choice([1, 2, 2, 3])
    for _ in range(n):
        spread = rng.uniform(0.25, 0.7) * (1 if rng.random() < 0.5 else -1)
        branch(d, rng, x2, y2, ang + spread, length * rng.uniform(0.62, 0.8),
               width * 0.66, depth - 1, color, up)


def tree(img, rng, cx, base):
    d = ImageDraw.Draw(img)
    top = hill_y(cx, base)
    # Rễ bám sâu dưới lớp đất nứt — sáng hơn đất một chút để "nhìn xuyên" thấy
    root_col = (78, 62, 50)
    for _ in range(7):
        branch(d, rng, cx + rng.uniform(-25, 25), top + 10, math.pi / 2 + rng.uniform(-0.9, 0.9),
               rng.uniform(130, 190), 22, 6, root_col, up=False)
    # Vết nứt đất
    for _ in range(14):
        x = rng.uniform(S * 0.2, S * 0.8)
        y = hill_y(x, base) + rng.uniform(40, 500)
        pts = [(x, y)]
        for _ in range(6):
            x += rng.uniform(-70, 70)
            y += rng.uniform(10, 50)
            pts.append((x, y))
        d.line(pts, fill=(44, 38, 34), width=5)
    # Thân + tán: hơi nghiêng như vừa chịu gió
    col = (16, 15, 15)
    d.polygon([(cx - 55, top + 20), (cx + 55, top + 20), (cx + 22, top - 520), (cx - 14, top - 520)], fill=col)
    for i in range(6):
        a = math.pi / 2 + rng.uniform(-0.95, 0.85) - 0.12
        y0 = top - rng.uniform(300, 520)
        branch(d, rng, cx + 4, y0, a, rng.uniform(230, 330), 34 - i * 2, 7, col)
    # Cành gãy dưới chân cây
    for _ in range(4):
        x = cx + rng.choice([-1, 1]) * rng.uniform(220, 650)
        y = hill_y(x, base) - 6
        ang = rng.uniform(-0.25, 0.25)
        L = rng.uniform(140, 260)
        d.line([(x, y), (x + math.cos(ang) * L, y - math.sin(ang) * L)], fill=col, width=14)
        branch(d, rng, x + L * 0.6, y, math.pi / 2 + rng.uniform(-0.5, 0.5), 60, 8, 3, col)


def grain(img, rng, amount=18):
    noise = Image.effect_noise(img.size, 40).convert("RGB")
    noise = noise.point(lambda v: 128 + (v - 128) * amount // 40)
    return ImageChops.add(ImageChops.subtract(img, Image.new("RGB", img.size, (8, 8, 8))),
                          ImageChops.subtract(noise, Image.new("RGB", img.size, (128, 128, 128))))


def vignette(img):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).ellipse([-S * 0.15, -S * 0.15, S * 1.15, S * 1.15], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(S * 0.12))
    return Image.composite(img, Image.new("RGB", img.size, (10, 10, 12)), mask)


def text(img, title, artist):
    d = ImageDraw.Draw(img)
    serif = ImageFont.truetype(str(FONTS / "Lora[wght].ttf"), 250)
    try:
        serif.set_variation_by_name("SemiBold")
    except Exception:
        pass
    sans = ImageFont.truetype(str(FONTS / "BeVietnamPro-Medium.ttf"), 92)

    t = title.upper()
    w = d.textlength(t, font=serif)
    size = 250
    while w > S * 0.84:
        size -= 10
        serif = ImageFont.truetype(str(FONTS / "Lora[wght].ttf"), size)
        w = d.textlength(t, font=serif)
    y_title = S - 430
    d.text(((S - w) / 2, y_title), t, font=serif, fill=PAPER)

    a = " ".join(artist.lower())
    wa = d.textlength(a, font=sans)
    y_art = y_title - 150
    d.text(((S - wa) / 2, y_art), a, font=sans, fill=EMBER)
    # Gạch nhỏ ngăn tên nghệ sĩ và tên bài
    d.line([(S / 2 - 60, y_title - 30), (S / 2 + 60, y_title - 30)], fill=EMBER, width=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--title", required=True)
    ap.add_argument("--artist", default="Senore")
    ap.add_argument("--seed", type=int, default=23)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()

    rng = random.Random(args.seed)
    horizon = int(S * 0.62)
    img = Image.new("RGB", (S, S))
    sky(img, horizon)
    img = glow(img, int(S * 0.64), horizon - 40, 420)
    img = clouds(img, rng, horizon)
    base = int(S * 0.7)
    ground(img, base)
    tree(img, rng, int(S * 0.5), base)
    # Nền đất phía dưới tối dần để chữ nổi
    shade = Image.new("L", img.size, 0)
    ds = ImageDraw.Draw(shade)
    for y in range(int(S * 0.72), S):
        ds.line([(0, y), (S, y)], fill=int(200 * (y - S * 0.72) / (S * 0.28)))
    img = Image.composite(Image.new("RGB", img.size, (14, 13, 13)), img, shade)
    img = vignette(img)
    img = grain(img, rng)
    text(img, args.title, args.artist)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "PNG", optimize=True)
    img.convert("RGB").save(out.with_suffix(".jpg"), "JPEG", quality=95, subsampling=0)
    print(f"✓ {out} và {out.with_suffix('.jpg')} ({S}×{S})")


if __name__ == "__main__":
    main()
