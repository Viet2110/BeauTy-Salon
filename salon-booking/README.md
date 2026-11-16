# Salon Booking – Hệ thống đặt lịch làm đẹp

Stack: **React (Vite) + Tailwind CSS** · **Node.js / Express** · **MySQL**

## Cấu trúc
```
salon-booking/
├── database/schema.sql      # tạo bảng + dữ liệu mẫu
├── backend/                 # API Express
└── frontend/                # React + Tailwind
```

## Chạy trên máy (local)

### 1. Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env     # sửa DB_PASSWORD, JWT_SECRET
npm install
npm run dev              # http://localhost:5000
```
Kiểm tra: mở `http://localhost:5000/api/health` → `{"ok":true}`

### 3. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev              # http://localhost:5173
```

## Endpoint

| Nhóm | Method | Endpoint | Auth |
|---|---|---|---|
| User | POST | `/api/auth/register` | |
| User | POST | `/api/auth/login` | |
| User | GET | `/api/auth/me` | ✔ |
| Salon | GET | `/api/salons` | |
| Salon | GET | `/api/salons/:id` | |
| Service | GET | `/api/salons/:id/services` | |
| Service | GET | `/api/services/:id` | |
| Service | POST | `/api/services/total` (`{serviceIds:[..]}` → tổng tiền) | |
| Beautician | GET | `/api/salons/:id/beauticians` | |
| Consultant | GET | `/api/consultants?salonId=` | |
| Booking | GET | `/api/appointments/slots?salonId=&date=&beauticianId=` (giờ đã bận) | |
| Booking | POST | `/api/appointments` (xác nhận đặt lịch) | ✔ |
| Appointment | GET | `/api/appointments` (danh sách của tôi) | ✔ |
| Appointment | GET | `/api/appointments/:id` (chi tiết) | ✔ |
| Appointment | PATCH | `/api/appointments/:id/cancel` | ✔ |
| Feedback | GET | `/api/feedbacks?salonId=` | |
| Feedback | POST | `/api/feedbacks` (rating 1–5 + comment) | ✔ |

Server luôn tự tính tổng tiền từ giá trong DB và chặn đặt trùng giờ của cùng nhân viên.

Trạng thái lịch: `pending` → `confirmed` → `completed` / `cancelled`. Hệ thống chưa có trang quản trị, nên để thử chức năng đánh giá theo lịch hẹn, đổi trạng thái bằng SQL:
```sql
UPDATE appointments SET status = 'completed' WHERE id = 1;
```

## Deploy miễn phí (gợi ý)

| Thành phần | Dịch vụ miễn phí | Ghi chú |
|---|---|---|
| MySQL | **TiDB Cloud Serverless** (tương thích MySQL) hoặc **Aiven for MySQL** (free plan) | Tạo DB → chạy `schema.sql` → lấy host/user/password, đặt `DB_SSL=true` |
| API (Node.js) | **Render** (Web Service, gói Free) | Root dir: `backend`, build `npm install`, start `npm start`, thêm biến môi trường như `.env.example` |
| Frontend | **Vercel** hoặc **Netlify** hoặc **Render Static Site** | Root dir: `frontend`, build `npm run build`, output `dist`, biến `VITE_API_URL=https://<api>.onrender.com/api` |

Lưu ý:
- Gói free của Render sẽ "ngủ" sau một thời gian không dùng, request đầu tiên có thể chậm ~30–60 giây.
- Đặt `CLIENT_ORIGIN` của backend thành URL frontend (ví dụ `https://salon.vercel.app`).
- Với Vercel/Netlify nên thêm rewrite mọi đường dẫn về `index.html` để React Router hoạt động.
- Gói miễn phí các dịch vụ có thể thay đổi; hãy kiểm tra điều khoản hiện tại trước khi deploy.

## Bảng dữ liệu
`users`, `salons`, `services`, `beauticians`, `consultants`, `appointments`, `appointment_services`, `feedbacks`.
