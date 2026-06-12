# Báo cáo Phase 3: Cloud Deployment

- **Họ và tên:** _________________________
- **Mã số sinh viên:** _________________________
- **Ngày thực hiện:** _________________________

---

##  Kết quả thực hiện các bài tập



###  Exercise 3.2: Deploy Render
- **So sánh `render.yaml` và `railway.toml`:**
  - File `render.yaml` có định dạng và mục đích gì?  
    Là file cấu hình (Infrastructure as Code) chuẩn của Render. Nó dùng để định nghĩa đồng thời nhiều tài nguyên (Web Service, Background worker, Redis, PostgreSQL...) trong cùng một hệ thống. Nó kiểm soát toàn bộ vòng đời: từ cấu hình runtime (python), cấu hình lệnh (build/start), biến môi trường cho tới tích hợp tự động deploy (CI/CD) khi push code lên GitHub.
  - File `railway.toml` (nếu có hoặc cấu hình trên railway) khác gì về cách khai báo các services phụ thuộc (như Redis)?  
    `railway.toml` thường tập trung khai báo cấu hình (build, start, healthcheck) cho một service đơn lẻ (ứng dụng hiện tại). Việc khai báo hoặc thêm các services phụ thuộc (như Database, Redis) trên Railway thường không khai báo trực tiếp qua file `railway.toml` mà được thêm và liên kết trực quan thông qua giao diện Railway Dashboard.

---

###  Exercise 3.3: (Optional) GCP Cloud Run
*Nếu bạn không làm phần này, hãy ghi "N/A" hoặc bỏ qua. Nếu có làm, hãy điền:*

- **Vai trò của `cloudbuild.yaml`:**  
  Cấu hình luồng CI/CD Pipeline tự động trên Google Cloud Build. File này định nghĩa các bước (steps) chạy tuần tự: (1) Cài đặt và chạy Unit Test, (2) Build Docker Image có sử dụng layer cache, (3) Đẩy (Push) image lên Container Registry, và (4) Trigger lệnh deploy lên dịch vụ Cloud Run.

- **Vai trò của `service.yaml`:**  
  Là bản mô tả kiến trúc dịch vụ (Knative Service Definition) trên Cloud Run. File này cấu hình thông số vận hành thực tế: tài nguyên cấp phát (CPU, RAM), chính sách scaling (min/max instances, timeout, concurrency), cách mount các Secrets an toàn từ Secret Manager làm biến môi trường, và định nghĩa các Liveness/Startup Probes để giữ app ổn định.

---

##  Xác nhận Checkpoint 3
Hãy tích chọn các mục bạn đã hoàn thành và hiểu rõ:

- [ ] Deploy thành công lên ít nhất 1 platform (Railway hoặc Render).
- [ ] Có public URL hoạt động thực tế.
- [ ] Hiểu cách set environment variables trên cloud dashboard.
- [ ] Biết cách xem live logs trên dashboard của Cloud platform.
