# Báo cáo Phase 5: Scaling & Reliability

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Kết quả thực hiện các bài tập

###  Exercise 5.1: Health checks
Hãy dán đoạn code các endpoint `/health` và `/ready` bạn đã hoàn thiện vào khối lệnh bên dưới:
```python
# Đoạn code hoàn chỉnh của bạn:

```

---

###  Exercise 5.2: Graceful shutdown
- Kết quả chạy thử nghiệm khi gửi tín hiệu `SIGTERM` trong lúc request đang xử lý:  
  [Điền kết quả quan sát của bạn: Request có bị ngắt giữa chừng không? Kết quả HTTP trả về là gì?]

- Hãy dán đoạn code xử lý hàm `shutdown_handler` bạn đã implement:
```python
# Đoạn code hoàn chỉnh của bạn:

```

---

###  Exercise 5.3: Stateless design
- Giải thích tại sao việc lưu conversation history vào bộ nhớ RAM (in-memory) của container là một anti-pattern khi scale ứng dụng ra nhiều instances?  
  [Câu trả lời của bạn]

- Lợi ích của việc chuyển sang lưu trữ trạng thái tại Redis là gì?  
  [Câu trả lời của bạn]

---

###  Exercise 5.4: Load balancing
- Kết quả chạy lệnh lặp 10 requests gửi tới Gateway/Nginx (Dán log chứng minh các requests được phân tán đều qua 3 instance):
```bash
# Logs đầu ra của docker compose logs agent:

```

---

###  Exercise 5.5: Test stateless
- Kết quả khi chạy script `python test_stateless.py` (Copy terminal output hoặc mô tả lại):
```bash
# Output:

```
- Cuộc trò chuyện có được tiếp tục bình thường sau khi một instance bị tắt ngẫu nhiên không?  
  [Có / Không, và giải thích tại sao]

---

##  Xác nhận Checkpoint 5
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [ ] Thực hiện thành công health check endpoint `/health` và `/ready`.
- [ ] Thực hiện cơ chế Graceful Shutdown để bảo vệ request đang chạy.
- [ ] Refactor mã nguồn từ Stateful sang Stateless design sử dụng Redis.
- [ ] Vận hành và kiểm tra hệ thống cân bằng tải với Nginx.
- [ ] Chạy thành công script kiểm thử `test_stateless.py`.
