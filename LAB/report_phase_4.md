# Báo cáo Phase 4: API Security

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Kết quả thực hiện các bài tập

###  Exercise 4.1: API Key authentication
- **API key được kiểm tra ở đoạn code nào?**  
  Nằm ở hàm `verify_api_key()` trong file `app.py`. Cụ thể là đoạn mã kiểm tra `if api_key != API_KEY:`

- **Status code khi thiếu hoặc sai API Key:**  
  Nếu thiếu Header `X-API-Key` thì trả về lỗi `401 Unauthorized`.
  Nếu gửi sai giá trị API Key thì trả về lỗi `403 Forbidden`.

- **Cách rotate API Key trên production:**  
  Vì ứng dụng được thiết kế đọc từ biến môi trường (`os.getenv("AGENT_API_KEY")`), nên khi cần đổi chìa khóa (rotate), ta chỉ cần vào Dashboard của Cloud (Render/Railway), cập nhật giá trị biến môi trường `AGENT_API_KEY` thành chuỗi mới và khởi động lại ứng dụng (Restart). Không cần sửa bất kỳ dòng code nào.

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
  Sliding Window Counter (Đếm theo cửa sổ trượt). Sử dụng cấu trúc dữ liệu `deque` để lưu trữ timestamp của các request và tự động loại bỏ những timestamp đã cũ (ngoài window_seconds).

- **Hạn mức tối đa được thiết lập:**  
  Đối với User thường: 10 requests / 60 giây (1 phút).
  Đối với Admin: 100 requests / 60 giây.

- **Cách bypass limit cho admin:**  
  Dựa vào payload (thông tin `role`) được giải mã từ JWT token. Hàm `ask_agent` sẽ kiểm tra nếu `role == "admin"`, hệ thống sẽ sử dụng đối tượng `rate_limiter_admin` (có hạn mức cực lớn) thay vì dùng `rate_limiter_user`.

- **Response nhận được khi bị giới hạn tần suất (Hit limit):**  
  [Copy terminal output hoặc ghi nhận HTTP Status code, ví dụ: 429 Too Many Requests]

---

###  Exercise 4.4: Cost guard
Hãy dán đoạn code hàm `check_budget` bạn đã hoàn thiện vào khối lệnh bên dưới:
```python
# Đoạn code hoàn chỉnh của bạn:
def check_budget(self, user_id: str) -> None:
    """
    Kiểm tra budget trước khi gọi LLM.
    Raise 402 nếu vượt budget.
    """
    record = self._get_record(user_id)

    # Global budget check (Tất cả users)
    if self._global_cost >= self.global_daily_budget_usd:
        logger.critical(f"GLOBAL BUDGET EXCEEDED: ${self._global_cost:.4f}")
        raise HTTPException(
            status_code=503,
            detail="Service temporarily unavailable due to budget limits. Try again tomorrow.",
        )

    # Per-user budget check (Từng cá nhân)
    if record.total_cost_usd >= self.daily_budget_usd:
        raise HTTPException(
            status_code=402,  # Payment Required
            detail={
                "error": "Daily budget exceeded",
                "used_usd": record.total_cost_usd,
                "budget_usd": self.daily_budget_usd,
                "resets_at": "midnight UTC",
            },
        )

    # Warning khi gần hết budget
    if record.total_cost_usd >= self.daily_budget_usd * self.warn_at_pct:
        logger.warning(
            f"User {user_id} at {record.total_cost_usd/self.daily_budget_usd*100:.0f}% budget"
        )
```

---

##  Xác nhận Checkpoint 4
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [x] Thực hiện thành công API key authentication.
- [x] Hiểu rõ luồng phát hành và xác thực JWT.
- [x] Thực hiện giới hạn tần suất sử dụng (Rate Limiting).
- [x] Thực hiện cơ chế Cost Guard kiểm tra budget với Redis.
