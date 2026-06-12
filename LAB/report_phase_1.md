# Báo cáo Phase 1: Localhost vs Production

- **Họ và tên:** [Tên Sinh Viên]
- **Mã số sinh viên:** [MSSV]
- **Ngày thực hiện:** [Ngày thực hiện]

---

##  Kết quả thực hiện các bài tập

###  Exercise 1.1: Phát hiện anti-patterns
Hãy liệt kê ít nhất 5 vấn đề (anti-patterns) bạn tìm thấy trong file `develop/app.py`:

1. **Vấn đề 1:** Hardcode API Key và Database URL trực tiếp vào mã nguồn. Nếu đưa lên GitHub sẽ lập tức bị lộ secrets.
2. **Vấn đề 2:** Không sử dụng Environment Variables để cấu hình ứng dụng (`DEBUG`, `MAX_TOKENS` bị fix cứng).
3. **Vấn đề 3:** Dùng `print()` thay vì thư viện logging chuyên dụng (Structured Logging), đồng thời bất cẩn in cả API Key ra logs.
4. **Vấn đề 4:** Không có các Endpoint Health check (như `/health` hay `/ready`). Nền tảng cloud/container sẽ không biết app có đang hoạt động tốt hay không để tự động khởi động lại.
5. **Vấn đề 5:** Tham số chạy server bị fix cứng cho local: host là `localhost` (không nhận traffic từ public/internet), port cố định `8000`, và bật chế độ `reload=True` (chỉ dành cho development).

---

###  Exercise 1.2: Chạy basic version
- Kết quả chạy lệnh `curl` test endpoint `/ask` (copy/paste output terminal vào đây):
```bash
# Output của bạn:
{"detail":[{"type":"missing","loc":["query","question"],"msg":"Field required","input":null}]}
```
- Nhận xét cá nhân về khả năng chạy production của phiên bản basic này:
Phiên bản này **chưa sẵn sàng cho production**.
Thứ nhất, ứng dụng bị code sai logic nhận tham số (nhận `question` từ Query parameter thay vì JSON Body) dẫn tới lỗi 422 Unprocessable Entity. Thứ hai, việc bind host vào `localhost` khiến nó không thể nhận request từ bên ngoài container. Ngoài ra, việc thiếu Graceful shutdown, Health check, và logging không chuẩn, cùng với việc lộ mật khẩu ra output console sẽ gây rủi ro rất lớn khi vận hành thực tế.

---

###  Exercise 1.3: So sánh với advanced version
Điền nội dung so sánh giữa 2 file `app.py`:

| Feature | Basic (Develop) | Advanced (Production) | Tại sao quan trọng? |
|---------|-----------------|-----------------------|---------------------|
| **Config** | Hardcode | Env vars | Bảo mật thông tin nhạy cảm. Dễ dàng thay đổi cấu hình tùy môi trường (dev, staging, prod) mà không cần sửa code. |
| **Health check** | Không có | Có (`/health`, `/ready`) | Giúp Load balancer/Orchestrator biết app còn sống không để restart hoặc điều hướng traffic hợp lý. |
| **Logging** | `print()` | JSON | JSON logs dễ phân tích tự động trên các hệ thống log (Datadog, ELK). Tránh lộ thông tin mật. |
| **Shutdown** | Đột ngột | Graceful | Đảm bảo các request đang xử lý dở được hoàn thành và đóng kết nối an toàn trước khi tắt ứng dụng. |

---

##  Xác nhận Checkpoint 1
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [x] Hiểu tại sao hardcode secrets là nguy hiểm.
- [x] Biết cách sử dụng environment variables (`.env`).
- [x] Hiểu vai trò của health check endpoint.
- [x] Biết graceful shutdown là gì và tầm quan trọng của nó.
