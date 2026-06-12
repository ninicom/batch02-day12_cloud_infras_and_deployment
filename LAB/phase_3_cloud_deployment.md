# Phase 3: Cloud Deployment (45 phút)

##  Mục tiêu
Sau khi hoàn thành phase này, bạn sẽ:
- Hiểu cách đưa ứng dụng từ local máy cá nhân lên môi trường Cloud hoạt động 24/7.
- Deploy thành công một Docker container lên các nền tảng PaaS (Railway hoặc Render).
- Biết cách cấu hình environment variables trên Cloud và xem log trực tiếp của dịch vụ.

---

##  Khái niệm (Concepts)

**Vấn đề:** Máy tính cá nhân không thể chạy liên tục 24/7 và không có địa chỉ IP công khai (Public IP) hoặc tên miền để người khác truy cập.
**Giải pháp:** Sử dụng các dịch vụ Cloud Platforms như Railway, Render, hoặc GCP Cloud Run để vận hành container.

**So sánh các dịch vụ Cloud:**

| Platform | Độ khó | Free tier | Thích hợp nhất cho |
|----------|--------|-----------|---------------------|
| **Railway** | ⭐ | $5 credit | Prototypes, thử nghiệm nhanh |
| **Render** | ⭐⭐ | 750h/tháng | Dự án cá nhân, portfolio |
| **GCP Cloud Run** | ⭐⭐⭐ | 2M requests/tháng | Môi trường production thực tế, scale lớn |

---

##  Các bài tập (Exercises)

###  Exercise 3.1: Deploy Railway (15 phút)

Di chuyển vào thư mục Railway:
```bash
cd 03-cloud-deployment/railway
```

**Các bước triển khai:**
1. Cài đặt Railway CLI toàn cục:
```bash
npm i -g @railway/cli
```
2. Đăng nhập vào tài khoản Railway:
```bash
railway login
```
3. Khởi tạo project mới trên Railway:
```bash
railway init
```
4. Thiết lập các biến môi trường (Environment variables):
```bash
railway variables set PORT=8000
railway variables set AGENT_API_KEY=my-secret-key
```
5. Đẩy code lên và triển khai (deploy):
```bash
railway up
```
6. Lấy tên miền công khai được Railway cấp phát:
```bash
railway domain
```

**Nhiệm vụ:** Kiểm tra public URL nhận được qua `curl` hoặc các công cụ kiểm tra HTTP.
```bash
# Health check
curl http://<your-railway-domain>/health

# Agent endpoint
curl http://<your-railway-domain>/ask -X POST \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello cloud"}'
```

---

###  Exercise 3.2: Deploy Render (15 phút)

Di chuyển vào thư mục Render:
```bash
cd ../render
```

**Các bước triển khai:**
1. Đẩy mã nguồn của bạn lên một repository GitHub (nếu chưa làm).
2. Truy cập [render.com](https://render.com) và đăng ký tài khoản.
3. Chọn **New** -> **Blueprint**.
4. Kết nối tài khoản GitHub và chọn repo chứa project này.
5. Render sẽ tự động đọc file cấu hình `render.yaml` trong thư mục.
6. Thiết lập các biến môi trường trên Dashboard của Render nếu cần thiết.
7. Click Deploy!

**Nhiệm vụ:** Đọc và so sánh cấu trúc file `render.yaml` và `railway.toml`. Điền kết quả so sánh vào [report_phase_3.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_3.md).

---

###  Exercise 3.3: (Optional) GCP Cloud Run (15 phút)

Di chuyển vào thư mục GCP Cloud Run:
```bash
cd ../production-cloud-run
```
*Yêu cầu: Bạn cần có một tài khoản Google Cloud Platform (GCP) đang kích hoạt.*

**Nhiệm vụ:** Đọc nội dung 2 file `cloudbuild.yaml` và `service.yaml`. Hãy phân tích cách xây dựng CI/CD pipeline và quản lý phiên bản container thông qua các file cấu hình này.

---

##  Checkpoint 3

Hãy tự kiểm tra xem bạn đã nắm vững các nội dung sau chưa:
- [ ] Deploy thành công ứng dụng lên ít nhất 1 Cloud Platform.
- [ ] Có public URL hoạt động thực tế.
- [ ] Hiểu cách cấu hình environment variables trên cloud console/CLI.
- [ ] Biết cách giám sát hoạt động thông qua cloud logs.

> [!IMPORTANT]
> Sau khi hoàn thành các bài tập trên, bạn hãy mở file [report_phase_3.md](file:///c:/AI_2026/project/batch02-day12_cloud_infras_and_deployment/LAB/report_phase_3.md) điền đầy đủ các câu trả lời và thông tin yêu cầu.
