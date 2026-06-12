# Báo cáo Phase 4: API Security

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Kết quả thực hiện các bài tập

###  Exercise 4.1: API Key authentication
- **API key được kiểm tra ở đoạn code nào?**  
  [Điền câu trả lời: ví dụ tên hàm hoặc file, dòng code]

- **Status code khi thiếu hoặc sai API Key:**  
  [Điền HTTP status code nhận được, ví dụ: 401 Unauthorized]

- **Cách rotate API Key trên production:**  
  [Giải thích cách bạn sẽ thay đổi API Key mà không cần sửa code]

- **Output kiểm tra với API Key chính xác (Copy terminal output):**
```json
// Output:

```

---

###  Exercise 4.2: JWT authentication (Advanced)
- **Token nhận được khi gọi POST `/token`:**  
  [Dán một phần hoặc toàn bộ token của bạn ở đây]

- **Kết quả gọi POST `/ask` bằng JWT token (Copy terminal output):**
```json
// Output:

```

---

###  Exercise 4.3: Rate limiting
- **Thuật toán Rate limiting được sử dụng:**  
  [Điền tên thuật toán]

- **Hạn mức tối đa được thiết lập:**  
  [Điền số request / thời gian]

- **Cách bypass limit cho admin:**  
  [Giải thích logic code bypass]

- **Response nhận được khi bị giới hạn tần suất (Hit limit):**  
  [Copy terminal output hoặc ghi nhận HTTP Status code, ví dụ: 429 Too Many Requests]

---

###  Exercise 4.4: Cost guard
Hãy dán đoạn code hàm `check_budget` bạn đã hoàn thiện vào khối lệnh bên dưới:
```python
# Đoạn code hoàn chỉnh của bạn:

```

---

##  Xác nhận Checkpoint 4
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [ ] Thực hiện thành công API key authentication.
- [ ] Hiểu rõ luồng phát hành và xác thực JWT.
- [ ] Thực hiện giới hạn tần suất sử dụng (Rate Limiting).
- [ ] Thực hiện cơ chế Cost Guard kiểm tra budget với Redis.
