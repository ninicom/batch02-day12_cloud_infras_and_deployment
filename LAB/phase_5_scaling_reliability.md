# Phase 5: Scaling & Reliability (40 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Implement Liveness và Readiness Probes (Health Check endpoints) cho API.
- Cấu hình Graceful Shutdown để xử lý các request đang chạy khi container bị tắt.
- Chuyển đổi ứng dụng từ Stateful sang Stateless design sử dụng Redis để lưu trữ hội thoại.
- Thiết lập và thử nghiệm cân bằng tải (Load Balancing) sử dụng Nginx.

---

##  Khái niệm (Concepts)

**Vấn đề:** Một server/instance đơn lẻ không thể chịu tải tốt khi lượng truy cập tăng vọt, hoặc khi ứng dụng gặp sự cố sẽ gây gián đoạn dịch vụ hoàn toàn.
**Giải pháp:**
1. **Stateless Design (Thiết kế phi trạng thái):** Không lưu trữ thông tin phiên làm việc (session state/memory) cục bộ trong RAM của container. Mọi dữ liệu trạng thái được đưa ra lưu trữ tập trung ở cơ sở dữ liệu hoặc Redis.
2. **Health Checks (Liveness và Readiness Probes):** Giúp Cloud Platform biết container nào còn sống (`/health`) và container nào sẵn sàng tiếp nhận traffic (`/ready`).
3. **Graceful Shutdown (Tắt ứng dụng an toàn):** Khi hệ thống thực hiện scale-in (giảm số instance) hoặc cập nhật phiên bản mới, container cũ sẽ nhận tín hiệu tắt (`SIGTERM`). Nó cần hoàn thành nốt các request đang xử lý trước khi dừng hoàn toàn.
4. **Load Balancing (Cân bằng tải):** Phân chia đều traffic từ khách hàng đến nhiều instance chạy song song.

---

##  Các bài tập (Exercises)

###  Exercise 5.1: Health checks

Di chuyển vào thư mục code phát triển:
```bash
cd 05-scaling-reliability/develop
```

**Nhiệm vụ:** Hoàn thiện 2 endpoints `/health` và `/ready` trong file `app.py`:

```python
@app.get("/health")
def health():
    """Liveness probe — container còn sống không?"""
    # TODO: Trả về HTTP 200 nếu process đang hoạt động bình thường
    pass

@app.get("/ready")
def ready():
    """Readiness probe — sẵn sàng nhận traffic không?"""
    # TODO: Kiểm tra kết nối tới Database, Redis, v.v.
    # Trả về HTTP 200 nếu OK, HTTP 503 nếu gặp lỗi
    pass
```

> [!TIP]
> Bạn có thể tham khảo phần code mẫu (Solution) ở file `CODE_LAB.md` gốc để hoàn thành logic này. Ghi đoạn code hoàn chỉnh vào file [report_phase_5.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_5.md).

---

###  Exercise 5.2: Graceful shutdown

**Nhiệm vụ:** Hoàn thiện signal handler trong file `app.py` để xử lý sự kiện tắt container đột ngột:

```python
import signal
import sys

def shutdown_handler(signum, frame):
    """Xử lý tín hiệu SIGTERM từ container orchestrator"""
    # TODO:
    # 1. Ngừng chấp nhận các request mới.
    # 2. Chờ hoàn thành nốt các request hiện tại.
    # 3. Đóng các kết nối cơ sở dữ liệu/Redis.
    # 4. Thoát chương trình (sys.exit(0)).
    pass

signal.signal(signal.SIGTERM, shutdown_handler)
```

**Cách chạy thử nghiệm:**
Chạy ứng dụng dưới nền:
```bash
python app.py &
PID=$!
```
Gửi một request xử lý tốn thời gian:
```bash
curl http://localhost:8000/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Long task"}' &
```
Ngay lập tức gửi tín hiệu kill tiến trình:
```bash
kill -TERM $PID
```
**Nhiệm vụ:** Quan sát và ghi nhận kết quả: Request có được hoàn thành và trả về response thành công hay không? Viết kết quả vào file report.

---

###  Exercise 5.3: Stateless design

Di chuyển sang thư mục production:
```bash
cd ../production
```

**Nhiệm vụ:** Nghiên cứu mã nguồn để chuyển đổi cơ chế quản lý lịch sử trò chuyện (Conversation History).
- **Anti-pattern (Stateful):** Lưu lịch sử trong một dictionary cục bộ trong bộ nhớ RAM (`conversation_history = {}`). Khi scale-out ra nhiều instance, mỗi instance sẽ lưu giữ một lịch sử trò chuyện riêng biệt, dẫn đến việc người dùng bị mất ngữ cảnh hội thoại khi request bị định tuyến sang instance khác.
- **Giải pháp (Stateless):** Chuyển sang lưu trữ lịch sử trên Redis (`r.lrange(f"history:{user_id}", 0, -1)`). Mọi instance đều đọc ghi chung vào một cụm Redis tập trung.

Hãy giải thích sự khác biệt và lợi ích của Stateless design trong việc scale ứng dụng vào file [report_phase_5.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_5.md).

---

###  Exercise 5.4: Load balancing

**Nhiệm vụ:** Chạy stack với Nginx đóng vai trò Load Balancer điều phối traffic cho 3 instance Agent hoạt động song song.

Khởi chạy hệ thống bằng Docker Compose với tham số scale-out:
```bash
docker compose up --scale agent=3
```

Hãy gọi liên tiếp 10 requests bằng vòng lặp:
```bash
for i in {1..10}; do
  curl http://localhost/ask -X POST \
    -H "Content-Type: application/json" \
    -d '{"question": "Request '$i'"}'
done
```

Kiểm tra logs của các instance agent để xem traffic có được phân tán đều không:
```bash
docker compose logs agent
```

---

###  Exercise 5.5: Test stateless

**Nhiệm vụ:** Chạy script kiểm thử tính phi trạng thái:
```bash
python test_stateless.py
```

Nguyên lý hoạt động của script:
1. Tạo một cuộc hội thoại (gửi câu hỏi số 1).
2. Tắt ngẫu nhiên một instance agent (giả lập sự cố sập server).
3. Tiếp tục gửi câu hỏi số 2 của phiên hội thoại đó. Kiểm tra xem Agent có duy trì được lịch sử hội thoại trước đó hay không.

Hãy ghi lại kết quả chạy script này vào file report.

---

##  Checkpoint 5

Hãy tự kiểm tra xem bạn đã nắm vững các nội dung sau chưa:
- [ ] Thực hiện thành công health check endpoint `/health` và `/ready`.
- [ ] Thực hiện cơ chế Graceful Shutdown để an toàn khi cập nhật ứng dụng.
- [ ] Refactor mã nguồn từ Stateful sang Stateless design.
- [ ] Chạy thử nghiệm và phân tích hoạt động của Load Balancer với Nginx.
- [ ] Chạy thành công script kiểm thử `test_stateless.py`.

> [!IMPORTANT]
> Sau khi hoàn thành các bài tập trên, bạn hãy mở file [report_phase_5.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_5.md) điền đầy đủ các câu trả lời và thông tin yêu cầu.
