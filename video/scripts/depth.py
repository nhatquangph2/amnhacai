#!/usr/bin/env python3
"""Tranh nền → video có chiều sâu 2.5D (DepthFlow + Depth Anything V2): lớp gần/xa trượt lệch nhau như máy quay thật.

    npm run depth -- HB-001                    # mọi tranh plate-*.png còn thiếu video
    npm run depth -- HB-001 --only plate-town --redo
    npm run depth -- HB-001 --move drift --amount 0.2 --seconds 12

Kết quả: public/HB-xxx/depth/<tranh>.mp4 (vòng lặp liền, cùng kích thước tranh) + <tranh>.depth.png (bản đồ độ sâu, dùng lại).
Máy quay chuyển động NHẸ, mặt phẳng lấy nét đặt ở tiền cảnh (lối mòn/tảng đá) → nhân vật ghép trong code không bị trượt.
Chạy trong .venv-fx (uv venv .venv-fx --python 3.12 && uv pip install --python .venv-fx/bin/python depthflow).
"""
import argparse
import math
import os
import sys
import time
from pathlib import Path

VIDEO = Path(__file__).resolve().parent.parent
os.environ["PATH"] = f"{VIDEO / '.venv-fx' / 'bin'}:{os.environ['PATH']}"  # ffmpeg (mượn của Remotion)

ap = argparse.ArgumentParser()
ap.add_argument("id")
ap.add_argument("--only", help="chỉ tranh có id chứa chuỗi này")
ap.add_argument("--redo", action="store_true", help="làm lại cả khi đã có video")
ap.add_argument("--move", default="drift", choices=["drift", "orbit", "push", "rise"])
ap.add_argument("--amount", type=float, default=0.18, help="độ mạnh chuyển động (0.1 rất nhẹ – 0.5 mạnh)")
ap.add_argument("--seconds", type=float, default=12, help="độ dài một vòng lặp")
ap.add_argument("--focus", type=float, default=0.55, help="độ sâu đứng yên (0 = xa nhất, 1 = gần nhất)")
ap.add_argument("--model", default="base", choices=["small", "base", "large"])
args = ap.parse_args()

from attrs import define  # noqa: E402
from depthflow.estimators.anything import DepthAnythingV2  # noqa: E402
from depthflow.scene import DepthScene  # noqa: E402
from PIL import Image  # noqa: E402
import numpy as np  # noqa: E402

A, F = args.amount, args.focus


@define
class Camera(DepthScene):
    def update(self):
        s = self.state
        c = self.cycle  # 0 → 2π trong một vòng lặp → nối liền
        s.height = 0.22
        s.steady = F
        s.focus = F
        s.isometric = 0.55
        s.zoom = 0.96  # phóng nhẹ để mép tranh không lộ vệt kéo giãn
        if args.move == "drift":  # trôi ngang chậm, hơi nhấp nhô — "đứng nhìn bờ sông"
            s.offset = (A * math.sin(c), 0.25 * A * math.sin(2 * c))
        elif args.move == "orbit":  # vòng quanh điểm lấy nét
            s.offset = (A * math.sin(c), 0.5 * A * math.cos(c))
        elif args.move == "push":  # tiến vào rồi lùi ra
            s.zoom = 0.96 - 0.06 * A / 0.18 * (1 - math.cos(c)) / 2
            s.dolly = 0.4 * A * (1 - math.cos(c))
        elif args.move == "rise":  # nâng lên hạ xuống
            s.offset = (0, A * math.sin(c))


art = VIDEO / "public" / args.id / "art"
out = VIDEO / "public" / args.id / "depth"
out.mkdir(parents=True, exist_ok=True)
plates = sorted(p for p in art.glob("plate-*.png") if not args.only or args.only in p.stem)
todo = [p for p in plates if args.redo or not (out / f"{p.stem}.mp4").exists()]
if not todo:
    sys.exit(f"✓ Đủ video chiều sâu rồi ({len(plates)} tranh). --redo để làm lại")

scene = Camera(backend="headless")
scene.estimator = DepthAnythingV2(model=args.model)
scene.ffmpeg.h264(preset="medium", crf=16)
for p in todo:
    tick = time.time()
    dfile = out / f"{p.stem}.depth.png"
    img = Image.open(p).convert("RGB")
    if dfile.exists() and not args.redo:
        depth = np.array(Image.open(dfile)).astype(np.float32) / 65535
    else:
        depth = scene.estimator.estimate(np.array(img))  # float 0–1, 1 = gần
        Image.fromarray((depth * 65535).astype(np.uint16)).save(dfile)
    scene.input(image=img, depth=depth)
    scene.main(output=out / f"{p.stem}.mp4", time=args.seconds, fps=30, width=img.width, height=img.height, ssaa=1.5)
    print(f"✓ depth/{p.stem}.mp4 ({time.time() - tick:.0f}s)")
