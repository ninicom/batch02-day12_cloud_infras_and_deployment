# Báo cáo Phase 6: Final Project

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Đường dẫn nộp bài

- **Public URL hoạt động:** https://ai-agent-3l8d.onrender.com/
- **Platform sử dụng:** Render
- **GitHub Repository URL:** https://github.com/ninicom/batch02-day12_cloud_infras_and_deployment

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
curl.exe https://ai-agent-3l8d.onrender.com/health

# Kết quả nhận được (Response):
{"status":"ok","environment":"production"}
```

### 2. API Test (Không gửi API Key - Bị chặn)
```bash
# Lệnh curl của bạn:
curl.exe https://ai-agent-3l8d.onrender.com/ask -X POST -s -H "Content-Type: application/json" -d '{"question": "Hi", "user_id": "test"}'

# Kết quả nhận được (Response):
{"detail":"Missing API key. Include header: X-API-Key: <your-key>"}
```

### 3. API Test (Gửi API Key hợp lệ)
```bash
# Lệnh curl của bạn:
curl.exe https://ai-agent-3l8d.onrender.com/ask -X POST -s -H "Content-Type: application/json" -H "X-API-Key: secret-key-123" -d '{"question": "Hi", "user_id": "test"}'

# Kết quả nhận được (Response):
{"session_id":"c65a0c8b-2a62-4363-bba2-58cc29d10c2e","question":"Hi","answer":"Tôi là AI agent được deploy lên cloud. Câu hỏi của bạn đã được nhận."}
```

### 4. Rate Limiting Test (Khi gửi liên tiếp vượt quá hạn mức)
```bash
# Lệnh curl/script của bạn:
1..15 | ForEach-Object { curl.exe https://ai-agent-3l8d.onrender.com/ask -X POST -s -H "Content-Type: application/json" -H "X-API-Key: secret-key-123" -d '{"question": "Hi", "user_id": "spam"}' }

# Kết quả nhận được (Response):
{"detail":"Rate limit exceeded. Maximum 10 requests per minute."}
```

---

##  Các biến môi trường đã được thiết lập trên Cloud Dashboard
- `PORT` = 8000
- `REDIS_URL` = redis://red-xxxxx.render.com:6379/0
- `AGENT_API_KEY` = secret-key-123
- `LOG_LEVEL` = INFO
- `RATE_LIMIT_PER_MINUTE` = 10
- `MONTHLY_BUDGET_USD` = 10.0

---

##  Bản tự đánh giá checklist trước khi nộp bài
Hãy tích chọn các mục bạn đã tự kiểm tra và hoàn thành:

- [x] Repository của bạn ở chế độ Public hoặc Giáo viên có quyền truy cập.
- [x] Báo cáo này đã điền đầy đủ các thông tin và kết quả chạy thực tế.
- [x] Không vô tình đẩy file `.env` lên GitHub (chỉ đẩy file `.env.example`).
- [x] Không chứa các API Key/Secrets dạng hardcode trong source code.
- [x] Đã đính kèm ảnh chụp màn hình chứng minh ứng dụng hoạt động vào thư mục `screenshots/`.
- [x] Lịch sử commit rõ ràng, sạch sẽ.
