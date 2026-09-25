# QC Checklist — `HB-___`

## Lời & giọng hát ⭐
- [ ] Đọc lời trong khi nghe: **mọi chữ đúng**, đúng dấu thanh, không nuốt chữ
- [ ] Không có câu AI tự thêm/lặp sai so với lời gốc
- [ ] Giọng hát cùng "chất" với các bài trước (giọng chủ đạo / Persona)
- [ ] Lời đã kiểm tra chính tả; `lyrics.txt` khớp 100% với bản hát

## Âm thanh
- [ ] Không có artifact AI (méo, rè kim loại, "nuốt" nốt)
- [ ] Không có điểm cắt lộ, không click/pop
- [ ] Fade-in / fade-out mượt
- [ ] Loudness ~-14 LUFS, True Peak ≤ -1 dBTP (`scripts/master.py --measure`)
- [ ] Giọng hát rõ, không bị nhạc lấn
- [ ] Nghe trên: ☐ tai nghe ☐ loa ☐ điện thoại
- [ ] Không "nghe quen" như bài nổi tiếng nào (đã thử Shazam)

## Pháp lý (xem docs/05)
- [ ] Tạo bằng gói trả phí có quyền thương mại — gói: ______ ngày: ______
- [ ] Prompt không có tên nghệ sĩ/bài hát thật
- [ ] Ảnh/font bên thứ ba có license, đã ghi nguồn
- [ ] Đã lưu nháp lời gốc có ngày + hóa đơn Suno tháng tạo bài
- [ ] Chủ đề nhạy cảm → mô tả có dòng hỗ trợ (docs/05 mục 6)

## Đóng gói
- [ ] `master.wav` 44.1kHz/24-bit + `preview.mp3` 320kbps
- [ ] Cover 3000×3000 · lyric video 1920×1080 · Canvas · 6+ Shorts
- [ ] `metadata.yaml` đã điền đủ
- [ ] `catalog/tracks.csv` đã cập nhật status

**Người duyệt:** ______ **Ngày:** ______ **Kết quả:** ☐ Đạt ☐ Sửa lại ☐ Loại
