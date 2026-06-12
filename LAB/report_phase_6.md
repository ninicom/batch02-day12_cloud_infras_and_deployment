# Báo cáo Phase 6: Final Project

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Đường dẫn nộp bài

- **Public URL hoạt động:** [Dán link deploy của bạn vào đây, ví dụ: https://my-agent.up.railway.app]
- **Platform sử dụng:** [Railway / Render / GCP Cloud Run]
- **GitHub Repository URL:** [Link repository của bạn]

---

##  Kết quả chạy Script Kiểm thử tự động (`check_production_ready.py`)
Dán kết quả đầu ra khi bạn chạy script kiểm tra:
```bash
# Output kiểm tra từ terminal:

```

---

##  Các lệnh kiểm tra hoạt động (Test Commands)

### 1. Health Check
```bash
# Lệnh curl của bạn:

# Kết quả nhận được (Response):

```

### 2. API Test (Không gửi API Key - Bị chặn)
```bash
# Lệnh curl của bạn:

# Kết quả nhận được (Response):

```

### 3. API Test (Gửi API Key hợp lệ)
```bash
# Lệnh curl của bạn:

# Kết quả nhận được (Response):

```

### 4. Rate Limiting Test (Khi gửi liên tiếp vượt quá hạn mức)
```bash
# Lệnh curl/script của bạn:

# Kết quả nhận được (Response):

```

---

##  Các biến môi trường đã được thiết lập trên Cloud Dashboard
- `PORT` = [Giá trị]
- `REDIS_URL` = [Giá trị]
- `AGENT_API_KEY` = [Giá trị]
- `LOG_LEVEL` = [Giá trị]
- [Các biến khác nếu có]

---

##  Bản tự đánh giá checklist trước khi nộp bài
Hãy tích chọn các mục bạn đã tự kiểm tra và hoàn thành:

- [ ] Repository của bạn ở chế độ Public hoặc Giáo viên có quyền truy cập.
- [ ] Báo cáo này đã điền đầy đủ các thông tin và kết quả chạy thực tế.
- [ ] Không vô tình đẩy file `.env` lên GitHub (chỉ đẩy file `.env.example`).
- [ ] Không chứa các API Key/Secrets dạng hardcode trong source code.
- [ ] Đã đính kèm ảnh chụp màn hình chứng minh ứng dụng hoạt động vào thư mục `screenshots/`.
- [ ] Lịch sử commit rõ ràng, sạch sẽ.
