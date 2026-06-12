# Phase 4: API Security (40 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Bảo mật API endpoints chống lại truy cập trái phép bằng API Key và JWT Authentication.
- Thiết lập cơ chế giới hạn tần suất yêu cầu (Rate Limiting) để tránh quá tải server.
- Xây dựng Cost Guard lưu trữ trên Redis nhằm kiểm soát chi phí sử dụng LLM của từng người dùng.

---

##  Khái niệm (Concepts)

**Vấn đề:** Khi ứng dụng được deploy lên internet với một Public URL công khai, bất kỳ ai cũng có thể gửi hàng triệu request đến Agent của bạn, dẫn đến cạn kiệt tài nguyên hệ thống hoặc làm phát sinh chi phí LLM khổng lồ.
**Giải pháp:**
1. **Authentication (Xác thực):** Chỉ cho phép những người dùng/ứng dụng hợp lệ được cấp API Key hoặc JWT Token truy cập.
2. **Rate Limiting (Giới hạn tần suất):** Giới hạn số lượng request tối đa một user có thể thực hiện trong một khoảng thời gian nhất định (ví dụ: 10 requests/phút).
3. **Cost Guard (Giới hạn ngân sách):** Theo dõi số tiền (hoặc số token LLM) mỗi người dùng tiêu thụ và chặn request nếu vượt quá hạn mức hàng tháng.

---

##  Các bài tập (Exercises)

###  Exercise 4.1: API Key authentication

Di chuyển vào thư mục code phát triển:
```bash
cd 04-api-gateway/develop
```

**Nhiệm vụ:** Đọc file `app.py` và trả lời các câu hỏi sau vào [report_phase_4.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_4.md):
- API key được kiểm tra ở đoạn code nào (dòng nào hoặc hàm nào)?
- Điều gì xảy ra (HTTP status code nào) nếu client gửi sai API Key hoặc không gửi API Key?
- Làm thế nào để thay đổi/thu hồi (rotate) API Key trong môi trường sản xuất thực tế?

Chạy ứng dụng:
```bash
python app.py
```

Mở terminal mới và thực hiện test:
```bash
#  Test không có key:
curl http://localhost:8000/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'

#  Test có key chính xác:
curl http://localhost:8000/ask -X POST \
  -H "X-API-Key: secret-key-123" \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello"}'
```

Ghi lại output của cả 2 trường hợp trên vào file report.

---

###  Exercise 4.2: JWT authentication (Advanced)

Di chuyển vào thư mục production:
```bash
cd ../production
```

**Nhiệm vụ:**
1. Đọc file `auth.py` để hiểu luồng xác thực JWT (JSON Web Token).
2. Chạy ứng dụng `python app.py` và gửi request để lấy JWT token:
```bash
curl http://localhost:8000/token -X POST \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "secret"}'
```
3. Sử dụng token nhận được để gọi API `/ask`:
```bash
TOKEN="<token_nhận_được_ở_bước_trên>"
curl http://localhost:8000/ask -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain JWT"}'
```

---

###  Exercise 4.3: Rate limiting

**Nhiệm vụ:** Đọc file `rate_limiter.py` và trả lời các câu hỏi vào [report_phase_4.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_4.md):
- Thuật toán giới hạn tần suất (Rate limiting algorithm) nào đang được sử dụng ở đây? (Ví dụ: Token bucket, Fixed window, Sliding window...)?
- Hạn mức tối đa được thiết lập là bao nhiêu request trong một phút?
- Làm thế nào để cấu hình bỏ qua giới hạn (bypass limit) cho tài khoản quản trị (admin)?

Chạy lệnh gọi liên tiếp 20 lần để test thử cơ chế chặn:
```bash
for i in {1..20}; do
  curl http://localhost:8000/ask -X POST \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"question": "Test '$i'"}'
  echo ""
done
```
Quan sát và ghi lại HTTP Status code khi ứng dụng kích hoạt giới hạn tần suất.

---

###  Exercise 4.4: Cost guard

**Nhiệm vụ:** Đọc file `cost_guard.py` và hoàn thiện logic hàm `check_budget` để ngăn chặn người dùng tiêu dùng quá hạn mức LLM:

```python
def check_budget(user_id: str, estimated_cost: float) -> bool:
    """
    Trả về True nếu còn budget, False nếu vượt quá hạn mức.
    
    Yêu cầu logic:
    - Mỗi user có budget tối đa $10/tháng.
    - Theo dõi chi tiêu thực tế thông qua Redis.
    - Tự động reset vào đầu tháng mới.
    """
    # TODO: Implement logic tại đây
    pass
```

> [!TIP]
> Bạn có thể tham khảo phần code mẫu của `cost_guard.py` trong phần gợi ý (Solution) ở file `CODE_LAB.md` gốc để hoàn thiện bài tập này. Ghi phần code bạn đã hoàn thiện vào file [report_phase_4.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_4.md).

---

##  Checkpoint 4

Hãy tự kiểm tra xem bạn đã nắm vững các nội dung sau chưa:
- [ ] Tích hợp thành công API key authentication vào router.
- [ ] Hiểu rõ luồng phát hành và xác thực của JSON Web Token (JWT).
- [ ] Thiết lập thành công middleware/dependency rate limiting.
- [ ] Hoàn thiện logic cost guard kiểm soát ngân sách LLM qua Redis.

> [!IMPORTANT]
> Sau khi hoàn thành các bài tập trên, bạn hãy mở file [report_phase_4.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_4.md) điền đầy đủ các câu trả lời và thông tin yêu cầu.
