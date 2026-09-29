"""Dựng banner YouTube 2560x1440 từ brand/visuals/senore-logo-source.png (chỉ cần Pillow).

Nền: bầu trời sao dựng mới (gradient dọc lấy từ ảnh gốc + sao ngẫu nhiên, seed cố định).
Logo: giữ nguyên khối logo xếp dọc từ ảnh gốc (thu 0.8 để cao ~410px, lọt vùng an toàn
1546x423 ở giữa banner), hoà mép mềm vào nền.
"""
import random

from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = "brand/visuals/senore-logo-source.png"
OUT = "brand/visuals/banner-2560x1440.png"
W, H = 2560, 1440
random.seed(7)

src = Image.open(SRC).convert("RGB")

# --- nền: gradient dọc = màu trung bình dải trái ảnh gốc (không có logo), làm mượt
col = src.crop((0, 0, 250, 896)).resize((1, 896), Image.BOX).filter(ImageFilter.GaussianBlur(12))
col = col.resize((1, H), Image.BICUBIC)
bg = col.resize((W, H), Image.NEAREST)

# dải ngân hà mờ: nhiễu làm mượt, nhân với dải chéo
noise = Image.effect_noise((W // 8, H // 8), 90).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
band = Image.new("L", (W, H), 0)
ImageDraw.Draw(band).polygon([(0, 900), (0, 1240), (W, 420), (W, 80)], fill=110)
band = band.filter(ImageFilter.GaussianBlur(220))
haze = ImageChops.multiply(band, noise.point(lambda v: min(255, int(v * 1.6))))
bg = ImageChops.add(bg, Image.merge("RGB", [haze.point(lambda v: v // 6), haze.point(lambda v: v // 9), haze.point(lambda v: v // 3)]))

# sao: lớp nhỏ + lớp sáng có quầng
small, big = Image.new("L", (W, H), 0), Image.new("L", (W, H), 0)
ds, db = ImageDraw.Draw(small), ImageDraw.Draw(big)
for _ in range(5200):
    x, y, b = random.randrange(W), random.randrange(H), random.random() ** 3.2
    ds.point((x, y), fill=int(70 + 185 * b))
    if b > 0.75:
        db.ellipse((x - 1, y - 1, x + 1, y + 1), fill=255)
small = small.filter(ImageFilter.GaussianBlur(0.8))
big = big.filter(ImageFilter.GaussianBlur(3.5)).point(lambda v: min(255, v * 2))
stars = ImageChops.add(small, big)
bg = ImageChops.add(bg, Image.merge("RGB", [stars, stars, stars.point(lambda v: min(255, int(v * 1.08)))]))
canvas = bg.convert("RGBA")

# --- logo: dán vùng ảnh gốc, hoà mép bằng mask elip làm mờ
SCALE = 0.8
crop = src.crop((190, 40, 1010, 880))
patch = crop.resize((int(crop.width * SCALE), int(crop.height * SCALE)), Image.LANCZOS)
mask = Image.new("L", patch.size, 0)
ImageDraw.Draw(mask).ellipse((40, 40, patch.width - 40, patch.height - 40), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(40)).point(lambda v: min(255, int(v * 1.7)))
lx, ly = int(410 * SCALE), int(405 * SCALE)  # tâm khối logo trong patch
canvas.paste(patch, (W // 2 - lx, H // 2 - ly), mask)

canvas.convert("RGB").save(OUT, optimize=True)
print(OUT, canvas.size)
