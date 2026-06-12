# Phase 2: Docker Containerization (45 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Containerize một AI agent bằng cách viết và tối ưu Dockerfile.
- Hiểu và áp dụng cơ chế Multi-stage builds để giảm dung lượng Docker image.
- Sử dụng Docker Compose để khởi chạy một stack dịch vụ (Agent, Redis, Nginx Load Balancer).
- Biết cách debug và tương tác với container thông qua các dòng lệnh Docker cơ bản.

---

##  Khái niệm (Concepts)

**Vấn đề:** *"Works on my machine" Part 2* — Mặc dù app chạy được trên máy bạn, nhưng khi deploy lên máy khác hoặc cloud lại bị lỗi do khác biệt phiên bản Python, thiếu dependencies, xung đột thư viện hệ thống.
**Giải pháp:** **Docker** — Đóng gói toàn bộ mã nguồn ứng dụng cùng toàn bộ môi trường và dependencies của nó vào một Docker Image chạy cách ly (isolated container).

**Lợi ích:**
- Môi trường nhất quán (Consistent environment) ở bất kỳ đâu.
- Dễ dàng deploy và quản lý.
- Cách ly tài nguyên (Isolation).
- Tạo các bản build tái sinh được (Reproducible builds).

---

##  Các bài tập (Exercises)

###  Exercise 2.1: Dockerfile cơ bản

Di chuyển vào thư mục của bài tập:
```bash
cd 02-docker/develop
```

**Nhiệm vụ:** Đọc file `Dockerfile` trong thư mục này và trả lời các câu hỏi sau vào file [report_phase_2.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_2.md):
1. Base image được sử dụng là gì?
2. Working directory (`WORKDIR`) được thiết lập ở thư mục nào trong container?
3. Tại sao chúng ta lại sao chép file `requirements.txt` (`COPY requirements.txt ...`) trước khi sao chép toàn bộ source code?
4. Điểm khác nhau cơ bản giữa câu lệnh `CMD` và `ENTRYPOINT` trong Dockerfile là gì?

---

###  Exercise 2.2: Build và run container

Chạy lệnh build image (lưu ý chạy từ thư mục root của project hoặc chỉ đúng đường dẫn file Dockerfile):
```bash
# Build image từ thư mục root của workspace
docker build -f 02-docker/develop/Dockerfile -t my-agent:develop .

# Run container
docker run -p 8000:8000 my-agent:develop
```

Test endpoint `/ask` của container:
```bash
curl http://localhost:8000/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "What is Docker?"}'
```

**Nhiệm vụ:** Kiểm tra và ghi lại dung lượng của Docker image vừa build vào file [report_phase_2.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_2.md):
```bash
docker images my-agent:develop
```

---

###  Exercise 2.3: Multi-stage build

Di chuyển sang thư mục production:
```bash
cd ../production
```

**Nhiệm vụ:** Đọc file `Dockerfile` trong thư mục production này để tìm hiểu cơ chế Multi-stage build và trả lời vào file [report_phase_2.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_2.md):
- Stage 1 (Builder) dùng để làm gì?
- Stage 2 (Runtime) dùng để làm gì?
- Tại sao kỹ thuật này giúp dung lượng image nhỏ hơn đáng kể?

Hãy build image phiên bản advanced này và ghi nhận dung lượng để so sánh:
```bash
docker build -t my-agent:advanced .
docker images | grep my-agent
```

---

###  Exercise 2.4: Docker Compose stack

**Nhiệm vụ:** Đọc file `docker-compose.yml` trong thư mục và phác thảo sơ đồ kiến trúc (architecture diagram) của hệ thống dịch vụ này.

Khởi chạy hệ thống bằng Docker Compose:
```bash
docker compose up
```

Trả lời vào báo cáo:
- Các dịch vụ (Services) nào được khởi động?
- Các dịch vụ communicate với nhau như thế nào (qua network nào)?

Kiểm tra hệ thống hoạt động:
```bash
# Health check endpoint của load balancer/gateway
curl http://localhost/health

# Agent endpoint qua gateway
curl http://localhost/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Explain microservices"}'
```

---

##  Checkpoint 2

Hãy tự kiểm tra xem bạn đã nắm vững các nội dung sau chưa:
- [ ] Hiểu cấu trúc cơ bản của một Dockerfile.
- [ ] Biết lợi ích và cách viết Dockerfile tối ưu bằng multi-stage builds.
- [ ] Hiểu cách phối hợp các container thông qua Docker Compose.
- [ ] Biết cách debug container thông qua log (`docker logs`) và truy cập terminal của container (`docker exec`).

> [!IMPORTANT]
> Sau khi hoàn thành các bài tập trên, bạn hãy mở file [report_phase_2.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_2.md) điền đầy đủ các câu trả lời và thông tin yêu cầu.
