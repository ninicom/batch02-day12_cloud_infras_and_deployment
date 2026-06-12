# Phase 1: Localhost vs Production (30 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Hiểu sự khác biệt giữa môi trường development (localhost) và production.
- Nhận diện được các anti-patterns thường gặp khi code trên localhost.
- Biết cách áp dụng các nguyên tắc của 12-Factor App (cấu hình qua env, health check, logging, graceful shutdown).

---

##  Khái niệm (Concepts)

**Vấn đề:** *"It works on my machine"* — code chạy tốt trên laptop cá nhân nhưng gặp lỗi khi deploy lên server/cloud.
**Nguyên nhân:**
- Hardcoded secrets (lộ API keys, credentials).
- Khác biệt về environment (Python version, OS, thư viện cài đặt).
- Không có health checks (server không biết khi nào app bị crash để tự khởi động lại).
- Config cứng, không linh hoạt.

**Giải pháp:** Áp dụng các nguyên tắc **12-Factor App**.

---

##  Các bài tập (Exercises)

###  Exercise 1.1: Phát hiện anti-patterns

Di chuyển vào thư mục của bài tập:
```bash
cd 01-localhost-vs-production/develop
```

**Nhiệm vụ:** Đọc file `app.py` trong thư mục này và tìm ít nhất **5 vấn đề (anti-patterns)** khiến ứng dụng chưa sẵn sàng cho production.
*Gợi ý: Tìm các phần liên quan đến API key, port, debug mode, health check, và cách ứng dụng kết thúc/shutdown.*

> [!TIP]
> Hãy ghi lại danh sách các anti-patterns này vào file [report_phase_1.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_1.md).

---

###  Exercise 1.2: Chạy basic version

Cài đặt thư viện và chạy phiên bản basic:
```bash
pip install -r requirements.txt
python app.py
```

Test thử endpoint bằng lệnh `curl`:
```bash
curl http://localhost:8000/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
```

**Quan sát:** Ứng dụng chạy thành công trên máy bạn. Hãy suy nghĩ xem tại sao nó chưa sẵn sàng chạy trên production (production-ready).

---

###  Exercise 1.3: So sánh với advanced version

Di chuyển sang thư mục production:
```bash
cd ../production
cp .env.example .env
pip install -r requirements.txt
python app.py
```

**Nhiệm vụ:** So sánh file `app.py` của bản `develop` và bản `production`. Hãy hoàn thành bảng so sánh dưới đây vào file [report_phase_1.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_1.md):

| Feature | Basic (Develop) | Advanced (Production) | Tại sao quan trọng? |
|---------|-----------------|-----------------------|---------------------|
| Config | Hardcode | Env vars | ... |
| Health check | ... | ... | ... |
| Logging | print() | JSON | ... |
| Shutdown | Đột ngột | Graceful | ... |

---

##  Checkpoint 1

Hãy tự kiểm tra xem bạn đã nắm vững các nội dung sau chưa:
- [ ] Hiểu tại sao hardcode secrets là nguy hiểm.
- [ ] Biết cách sử dụng environment variables (`.env`).
- [ ] Hiểu vai trò của health check endpoint.
- [ ] Biết graceful shutdown là gì và tầm quan trọng của nó.

> [!IMPORTANT]
> Sau khi hoàn thành các bài tập trên, bạn hãy mở file [report_phase_1.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_1.md) điền đầy đủ các câu trả lời và thông tin yêu cầu.
