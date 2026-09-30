#!/usr/bin/env python3
"""Tách nền xanh lá (#00FF00) → PNG trong suốt, viền mềm, khử viền xanh, cắt sát nhân vật.

    .venv/bin/python scripts/chroma.py in.png out.png
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA")
a = np.asarray(img).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]

# Độ "xanh": g vượt hẳn r và b → nền. Chuyển mềm để giữ viền tóc/vải.
greenness = g - np.maximum(r, b)
alpha = np.clip(1.0 - (greenness - 40) / 80.0, 0, 1)
# Khử viền xanh còn lại (despill): kéo g về không quá max(r, b)
spill = np.clip(g - np.maximum(r, b), 0, None)
a[..., 1] = g - spill * (1 - alpha) - np.clip(spill * 0.6, 0, None) * alpha * (greenness > 10)
a[..., 3] = alpha * 255

out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
# Làm mềm mép alpha một chút
al = out.getchannel("A").filter(ImageFilter.GaussianBlur(0.7))
out.putalpha(al)
bbox = al.point(lambda v: 255 if v > 8 else 0).getbbox()
if bbox:
    pad = 6
    out = out.crop((max(bbox[0] - pad, 0), max(bbox[1] - pad, 0), min(bbox[2] + pad, out.width), min(bbox[3] + pad, out.height)))
out.save(dst)
print(f"✓ {dst} {out.size[0]}×{out.size[1]}")
