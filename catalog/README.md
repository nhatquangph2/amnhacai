# Catalog — nguồn dữ liệu duy nhất

| File | Nội dung |
|---|---|
| `tracks.csv` | Mọi bài hát (mỗi dòng 1 bài, mã `HB-xxx`). Thêm dòng tự động bằng `scripts/new_track.py` |
| `content-calendar.csv` | Lịch đăng: video dài, Shorts, single, EP |
| `platforms.csv` | Tiến độ thiết lập từng nền tảng (todo / waiting / later / done) |

Mở bằng Excel / Google Sheets (File → Import → UTF-8). Khi sửa trên Sheets, tải lại dạng CSV và commit.

## Vòng đời `status` của một bài
`idea → lyrics → generating → selected → mastered → packaged → scheduled → released` (hoặc `rejected`)

## Mã series
`dung-day` (Đứng Dậy) · `doi-nguoi` (Đời Người) · `y-nghia` (Câu Hỏi Lớn) · `nghe-thuat` (Người Sáng Tạo)
