#!/usr/bin/env python3
"""Tạo hồ sơ cho một bài hát mới của Healing Box.

- Sinh mã bài tiếp theo (HB-001, HB-002, ...) dựa trên catalog/tracks.csv
- Tạo thư mục releases/HB-xxx_<slug>/ với cấu trúc chuẩn + metadata.yaml
- Thêm một dòng vào catalog/tracks.csv (status = draft)

Ví dụ:
    python3 scripts/new_track.py --title "Mưa Trên Hiên Nhà" --series rain-piano --mood calm --bpm 70
"""

import argparse
import csv
import datetime as dt
import re
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "catalog" / "tracks.csv"
RELEASES = ROOT / "releases"

SERIES = [
    "rain-piano",
    "lofi-study",
    "deep-sleep",
    "morning-calm",
    "zen-meditation",
    "vn-healing-songs",
]

FIELDS = [
    "id", "title", "title_en", "series", "mood", "bpm", "key", "duration_sec",
    "status", "ai_tool", "ai_plan", "created_date", "release_date",
    "spotify_url", "youtube_url", "notes",
]

METADATA_TEMPLATE = """\
# Hồ sơ bài hát — {id}
id: {id}
title: "{title}"
title_en: "{title_en}"
artist: "Healing Box"
series: {series}
mood: "{mood}"
bpm: {bpm}
key: "{key}"
status: draft            # idea → draft → selected → mastered → packaged → scheduled → released

# --- Bằng chứng sáng tác (bắt buộc, xem docs/05) ---
creation:
  ai_tool: "{ai_tool}"
  ai_plan: "{ai_plan}"   # gói trả phí có quyền thương mại tại thời điểm tạo
  created_date: {today}
  source_link: ""        # link/ID bản gốc trên công cụ AI
  prompt: |

  lyrics_file: ""        # lyrics.txt nếu có lời (do con người viết)
  human_contribution:    # những gì bạn đã làm thêm
    - ""                 # vd: cắt ghép cấu trúc, thêm tiếng mưa, EQ/master

# --- Tài nguyên bên thứ ba ---
third_party_assets:
  - type: ""             # ambience / image / font / footage
    source: ""
    license: ""

# --- Kỹ thuật ---
audio:
  master: "audio/{id}_{slug}_master.wav"
  loudness_lufs: null
  true_peak_dbtp: null
  duration_sec: null

# --- Phát hành ---
release:
  date: ""
  distributor: ""
  isrc: ""
  content_id: false      # khuyến nghị tắt (docs/04 mục 5)
  spotify_url: ""
  youtube_url: ""

qc:
  reviewed_by: ""
  reviewed_date: ""
  result: ""             # pass / fix / reject
"""


def slugify(text: str) -> str:
    text = text.replace("đ", "d").replace("Đ", "D")
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or "untitled"


def read_rows() -> list[dict]:
    if not CATALOG.exists():
        return []
    with CATALOG.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def next_id(rows: list[dict]) -> str:
    numbers = [
        int(m.group(1))
        for r in rows
        if (m := re.fullmatch(r"HB-(\d+)", r.get("id", "")))
    ]
    return f"HB-{(max(numbers, default=0) + 1):03d}"


def yaml_str(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--title", required=True, help="Tên bài (tiếng Việt)")
    p.add_argument("--title-en", default="", help="Tên tiếng Anh (tùy chọn)")
    p.add_argument("--series", required=True, choices=SERIES)
    p.add_argument("--mood", default="")
    p.add_argument("--bpm", type=int, default=None)
    p.add_argument("--key", default="")
    p.add_argument("--ai-tool", default="Suno")
    p.add_argument("--ai-plan", default="", help="Gói đăng ký đang dùng, vd: Pro")
    p.add_argument("--dry-run", action="store_true", help="Chỉ in ra, không ghi file")
    args = p.parse_args()

    rows = read_rows()
    track_id = next_id(rows)
    slug = slugify(args.title)
    today = dt.date.today().isoformat()
    folder = RELEASES / f"{track_id}_{slug}"

    row = {k: "" for k in FIELDS}
    row.update(
        id=track_id, title=args.title, title_en=args.title_en, series=args.series,
        mood=args.mood, bpm=args.bpm or "", key=args.key, status="draft",
        ai_tool=args.ai_tool, ai_plan=args.ai_plan, created_date=today,
    )

    metadata = METADATA_TEMPLATE.format(
        id=track_id, title=yaml_str(args.title), title_en=yaml_str(args.title_en),
        series=args.series, mood=yaml_str(args.mood),
        bpm=args.bpm if args.bpm is not None else "null", key=yaml_str(args.key),
        ai_tool=yaml_str(args.ai_tool), ai_plan=yaml_str(args.ai_plan),
        today=today, slug=slug,
    )

    if args.dry_run:
        print(f"[dry-run] Sẽ tạo {folder.relative_to(ROOT)}")
        print(metadata)
        return 0

    if folder.exists():
        print(f"Lỗi: {folder} đã tồn tại", file=sys.stderr)
        return 1

    for sub in ("audio/stems", "artwork", "video"):
        (folder / sub).mkdir(parents=True, exist_ok=True)
    (folder / "metadata.yaml").write_text(metadata, encoding="utf-8")
    if args.series == "vn-healing-songs":
        (folder / "lyrics.txt").write_text(
            "[Verse 1]\n\n[Pre-Chorus]\n\n[Chorus]\n\n[Verse 2]\n\n[Chorus]\n\n[Bridge]\n\n[Final Chorus]\n",
            encoding="utf-8",
        )

    write_header = not CATALOG.exists() or CATALOG.stat().st_size == 0
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    with CATALOG.open("a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if write_header:
            writer.writeheader()
        writer.writerow(row)

    print(f"✅ Đã tạo {track_id}: {args.title}")
    print(f"   Thư mục : {folder.relative_to(ROOT)}")
    print(f"   Catalog : {CATALOG.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
