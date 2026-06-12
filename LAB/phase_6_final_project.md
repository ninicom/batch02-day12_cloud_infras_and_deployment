# Phase 6: Final Project (60 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Kết hợp toàn bộ các kỹ thuật đã học ở các phase trước để xây dựng một **Production-ready AI Agent** từ đầu.
- Tự triển khai ứng dụng lên Cloud (Railway hoặc Render) dưới dạng một dịch vụ hoàn chỉnh.
- Sử dụng các script kiểm thử tự động để đánh giá xem ứng dụng đã sẵn sàng cho môi trường Production hay chưa.

---

##  Yêu cầu dự án (Requirements)

### 1. Yêu cầu chức năng (Functional)
- Agent nhận câu hỏi và trả lời qua REST API endpoint `/ask`.
- Hỗ trợ lưu lịch sử hội thoại (Conversation History) để ghi nhớ ngữ cảnh.
- Hỗ trợ Streaming responses (Không bắt buộc).

### 2. Yêu cầu phi chức năng (Non-functional)
- **Containerization:** Đóng gói ứng dụng sử dụng Dockerfile Multi-stage build để tối ưu dung lượng image.
- **Config Management:** Quản lý toàn bộ cấu hình ứng dụng qua Environment Variables (không hardcode secrets).
- **Authentication:** Bảo mật endpoint bằng API key hoặc JWT token.
- **Rate Limiting:** Giới hạn tần suất sử dụng (tối đa 10 requests/phút cho mỗi người dùng).
- **Cost Guard:** Giới hạn ngân sách sử dụng LLM tối đa $10/tháng cho mỗi user sử dụng Redis.
- **Reliability:** Implement đủ 2 endpoints `/health` (Liveness) và `/ready` (Readiness) cùng cơ chế Graceful Shutdown (xử lý tín hiệu `SIGTERM`).
- **Scalability:** Thiết kế ứng dụng Stateless (lưu trữ conversation history trong Redis thay vì RAM).
- **Logging:** Xuất nhật ký hệ thống theo cấu trúc JSON định dạng chuẩn (Structured Logging).
- **Deployment:** Deploy thành công dự án lên nền tảng Cloud (Railway hoặc Render) có public URL hoạt động ổn định.

---

## 🏗 Kiến trúc hệ thống (Architecture)

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Nginx (LB)     │
└──────┬──────────┘
       │
       ├─────────┬─────────┐
       ▼         ▼         ▼
   ┌──────┐  ┌──────┐  ┌──────┐
   │Agent1│  │Agent2│  │Agent3│
   └───┬──┘  └───┬──┘  └───┬──┘
       │         │         │
       └─────────┴─────────┘
                 │
                 ▼
           ┌──────────┐
           │  Redis   │
           └──────────┘
```

---

##  Các bước thực hiện từng bước (Step-by-step)

### Step 1: Khởi tạo cấu trúc dự án (Project setup) (5 phút)
Tạo thư mục dự án và các file cần thiết:
```bash
mkdir my-production-agent
cd my-production-agent

# Tạo cấu trúc thư mục
mkdir -p app
touch app/__init__.py
touch app/main.py
touch app/config.py
touch app/auth.py
touch app/rate_limiter.py
touch app/cost_guard.py
touch Dockerfile
touch docker-compose.yml
touch requirements.txt
touch .env.example
touch .dockerignore
```

### Step 2: Quản lý cấu hình (Config management) (10 phút)
**File:** `app/config.py`
Xây dựng lớp cấu hình kế thừa từ `BaseSettings` của Pydantic để tự động load các cấu hình từ biến môi trường. Định nghĩa các biến cấu hình cần thiết như `PORT`, `REDIS_URL`, `AGENT_API_KEY`, `LOG_LEVEL`, `RATE_LIMIT_PER_MINUTE`, và `MONTHLY_BUDGET_USD`.

### Step 3: Phát triển ứng dụng chính (Main application) (15 phút)
**File:** `app/main.py`
Khởi tạo ứng dụng FastAPI. Định nghĩa các Router, xử lý tín hiệu Graceful Shutdown, kết hợp các dependency như xác thực (authentication), rate limiter, và cost guard. Gọi LLM và xử lý lưu/đọc lịch sử hội thoại với Redis.

### Step 4: Xác thực (Authentication) (5 phút)
**File:** `app/auth.py`
Xây dựng hàm Dependency `verify_api_key` để kiểm tra Header `X-API-Key` của request. Nếu hợp lệ, trả về `user_id`, nếu không hợp lệ thì quẹt lỗi `HTTPException(status_code=401)`.

### Step 5: Giới hạn tần suất (Rate limiting) (10 phút)
**File:** `app/rate_limiter.py`
Sử dụng Redis để đếm số lượng truy cập của từng người dùng bằng thuật toán Sliding Window hoặc Token Bucket. Quẹt lỗi `HTTPException(status_code=429)` nếu người dùng vượt quá hạn mức.

### Step 6: Cost Guard (10 phút)
**File:** `app/cost_guard.py`
Tương tự, ghi nhận chi phí sử dụng của từng `user_id` lên Redis theo tháng dạng `budget:user_id:YYYY-MM`. Quẹt lỗi `HTTPException(status_code=402)` nếu người dùng đã tiêu hết $10 hạn mức của tháng đó.

### Step 7: Viết Dockerfile Multi-stage (5 phút)
**File:** `Dockerfile`
Tối ưu hóa Dockerfile để dung lượng Image khi build ra có kích thước nhỏ gọn nhất có thể (< 500 MB).

### Step 8: Docker Compose (5 phút)
**File:** `docker-compose.yml`
Định nghĩa 3 services: `agent` (thiết lập scale 3 replicas), `redis` (database lưu session state), và `nginx` (làm load balancer/gateway).

### Step 9: Thử nghiệm cục bộ (5 phút)
Chạy thử nghiệm toàn bộ hệ thống trên local máy của bạn:
```bash
docker compose up --scale agent=3
```
Test thử các endpoint bao gồm cả trường hợp hợp lệ và không hợp lệ:
```bash
curl http://localhost/health
curl http://localhost/ready
curl -H "X-API-Key: secret" http://localhost/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello", "user_id": "user1"}'
```

### Step 10: Deploy lên Cloud (10 phút)
Sử dụng Railway CLI hoặc Render Dashboard để đưa ứng dụng lên cloud. Cập nhật đầy đủ các biến môi trường cấu hình trên dashboard của cloud platform đó.

---

##  Đánh giá và Kiểm tra (Validation)

Để kiểm tra độ chính xác của bài làm, hãy di chuyển vào thư mục complete của lab và chạy script kiểm thử:
```bash
cd 06-lab-complete
python check_production_ready.py
```
Script này sẽ tự động kiểm tra xem ứng dụng của bạn có đáp ứng đầy đủ tiêu chuẩn production-ready hay không bao gồm: sự tồn tại của Dockerfile, multi-stage build, .dockerignore, hoạt động của các API authentication, rate limiting, cost guard, graceful shutdown, stateless design và structured logging.

---

##  Tiêu chí chấm điểm (Grading Rubric)

| Tiêu chí | Điểm tối đa | Mô tả |
|----------|-------------|-------|
| **Functionality** | 20 | Agent hoạt động đúng theo chức năng |
| **Docker** | 15 | Dockerfile viết chuẩn multi-stage, dung lượng tối ưu |
| **Security** | 20 | Hỗ trợ Auth + Rate Limit + Cost Guard đầy đủ |
| **Reliability** | 20 | Đầy đủ Health Checks endpoints + Graceful Shutdown |
| **Scalability** | 15 | Ứng dụng Stateless + Cân bằng tải với Nginx |
| **Deployment** | 10 | Đã deploy và có Public URL hoạt động tốt |
| **Tổng cộng** | **100** | |

> [!IMPORTANT]
> Sau khi hoàn thành Final Project, bạn hãy mở file [report_phase_6.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_6.md) điền đầy đủ thông tin báo cáo nộp bài.
