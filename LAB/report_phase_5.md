# Báo cáo Phase 5: Scaling & Reliability

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Kết quả thực hiện các bài tập

###  Exercise 5.1: Health checks
Hãy dán đoạn code các endpoint `/health` và `/ready` bạn đã hoàn thiện vào khối lệnh bên dưới:
```python
```python
@app.get("/health")
def health():
    uptime = round(time.time() - START_TIME, 1)
    checks = {}
    try:
        import psutil
        mem = psutil.virtual_memory()
        checks["memory"] = {"status": "ok" if mem.percent < 90 else "degraded"}
    except ImportError:
        pass
    overall_status = "ok" if all(v.get("status") == "ok" for v in checks.values()) else "degraded"
    return {"status": overall_status, "uptime_seconds": uptime, "checks": checks}

@app.get("/ready")
def ready():
    if not _is_ready:
        raise HTTPException(503, "Agent not ready")
    return {"ready": True, "in_flight_requests": _in_flight_requests}
```

---

###  Exercise 5.2: Graceful shutdown
- Kết quả chạy thử nghiệm khi gửi tín hiệu `SIGTERM` trong lúc request đang xử lý:  
  Request **không bị ngắt giữa chừng** mà vẫn được xử lý hoàn tất, kết quả HTTP trả về là 200 OK. Hệ thống sẽ đợi tất cả các request đang bay (in-flight) chạy xong trước khi tắt hẳn.

- Hãy dán đoạn code xử lý hàm `shutdown_handler` bạn đã implement:
```python
```python
# Đoạn code hoàn chỉnh của bạn:
def handle_sigterm(signum, frame):
    logger.info(f"Received signal {signum} — uvicorn will handle graceful shutdown")

signal.signal(signal.SIGTERM, handle_sigterm)
signal.signal(signal.SIGINT, handle_sigterm)
```

---

###  Exercise 5.3: Stateless design
- Giải thích tại sao việc lưu conversation history vào bộ nhớ RAM (in-memory) của container là một anti-pattern khi scale ứng dụng ra nhiều instances?  
  Vì Load Balancer (ví dụ Nginx) sẽ phân bổ request liên tiếp của một user tới các server ngẫu nhiên khác nhau. Nếu server 1 lưu lịch sử vào RAM, thì khi user gửi request tiếp theo trúng vào server 2, ngữ cảnh trước đó sẽ biến mất hoàn toàn do server 2 không chia sẻ RAM với server 1.

- Lợi ích của việc chuyển sang lưu trữ trạng thái tại Redis là gì?  
  1. Trạng thái tập trung (Centralized): Bất kỳ instance nào cũng có thể đọc/ghi dữ liệu từ Redis.
  2. Stateless Web Tier: Cho phép Web server có thể tăng/giảm số lượng tự do (Auto-scaling) hoặc tắt đột ngột mà không sợ làm mất dữ liệu của người dùng.

---

###  Exercise 5.4: Load balancing
- Kết quả chạy lệnh lặp 10 requests gửi tới Gateway/Nginx (Dán log chứng minh các requests được phân tán đều qua 3 instance):
```bash
# Output:
{"session_id":"9df899b3-56be-42cf-b648-d6396720563f","question":"Test load balancing","answer":"Tôi là AI agent được deploy lên cloud. Câu hỏi của bạn đã được nhận.","turn":2,"served_by":"instance-bed814","storage":"in-memory"}
{"session_id":"79f2b267-0c83-49dc-82f7-c95c4a73879c","question":"Test load balancing","answer":"Tôi là AI agent được deploy lên cloud. Câu hỏi của bạn đã được nhận.","turn":1,"served_by":"instance-cef31e","storage":"in-memory"}
```

---

###  Exercise 5.5: Test stateless
- Kết quả khi chạy script `python test_stateless.py` (Copy terminal output hoặc mô tả lại):
```bash
# Output:
Total requests: 5
Instances used: {'instance-bed814', 'instance-cef31e', 'instance-f0fec1'}
✅ All requests served despite different instances!

--- Conversation History ---
Total messages: 2
  [user]: What is Kubernetes?...
  [assistant]: Đây là câu trả lời từ AI agent (mock). Trong production, đây...

✅ Session history preserved across all instances via Redis!
```
- Cuộc trò chuyện có được tiếp tục bình thường sau khi một instance bị tắt ngẫu nhiên không?  
  Có. Nhờ việc lưu trữ dữ liệu tại Redis tập trung, các instances Web API đều có thể truy xuất lại đầy đủ toàn bộ bối cảnh (context) hội thoại của session_id đó, giúp user không cảm nhận được bất kỳ sự gián đoạn nào dù server đằng sau bị thay đổi.

---

##  Xác nhận Checkpoint 5
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [x] Thực hiện thành công health check endpoint `/health` và `/ready`.
- [x] Thực hiện cơ chế Graceful Shutdown để bảo vệ request đang chạy.
- [x] Refactor mã nguồn từ Stateful sang Stateless design sử dụng Redis.
- [x] Vận hành và kiểm tra hệ thống cân bằng tải với Nginx.
- [x] Chạy thành công script kiểm thử `test_stateless.py`.
