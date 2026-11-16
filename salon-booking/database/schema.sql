-- Salon Booking - MySQL schema + dữ liệu mẫu
CREATE DATABASE IF NOT EXISTS salon_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE salon_booking;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  description TEXT,
  image_url VARCHAR(500),
  open_time TIME NOT NULL DEFAULT '08:00:00',
  close_time TIME NOT NULL DEFAULT '20:00:00'
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  price DECIMAL(12,0) NOT NULL,
  duration_min INT NOT NULL DEFAULT 60,
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS beauticians (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(150),
  avatar_url VARCHAR(500),
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consultants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  salon_id INT NULL,
  name VARCHAR(100) NOT NULL,
  specialty VARCHAR(150),
  phone VARCHAR(20),
  email VARCHAR(150),
  avatar_url VARCHAR(500),
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  salon_id INT NOT NULL,
  beautician_id INT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(150),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  total_price DECIMAL(12,0) NOT NULL,
  total_duration INT NOT NULL,
  status ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  note VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (salon_id) REFERENCES salons(id),
  FOREIGN KEY (beautician_id) REFERENCES beauticians(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointment_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  appointment_id INT NOT NULL,
  service_id INT NOT NULL,
  price DECIMAL(12,0) NOT NULL,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS feedbacks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  salon_id INT NOT NULL,
  appointment_id INT NULL,
  rating TINYINT NOT NULL,
  comment VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

-- ===== Dữ liệu mẫu =====
INSERT INTO salons (name, address, phone, description, image_url, open_time, close_time) VALUES
('Lotus Beauty Salon', '12 Bạch Đằng, Hải Châu, Đà Nẵng', '0236 111 2222', 'Salon chăm sóc tóc, da và móng với không gian thư giãn.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', '08:00:00', '20:00:00'),
('Rose Hair & Spa', '45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng', '0236 333 4444', 'Chuyên làm tóc, gội đầu dưỡng sinh và spa body.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', '09:00:00', '21:00:00'),
('Pretty Nails Studio', '88 Lê Duẩn, Hải Châu, Đà Nẵng', '0236 555 6666', 'Nail art, chăm sóc móng tay, móng chân.', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800', '09:00:00', '19:00:00');

INSERT INTO services (salon_id, name, description, price, duration_min) VALUES
(1, 'Cắt tóc nữ', 'Tư vấn kiểu, gội và sấy tạo kiểu', 150000, 45),
(1, 'Nhuộm tóc', 'Nhuộm thời trang, thuốc nhập khẩu', 650000, 120),
(1, 'Chăm sóc da mặt', 'Làm sạch sâu, đắp mặt nạ dưỡng ẩm', 350000, 60),
(1, 'Làm móng tay', 'Cắt da, dũa, sơn gel', 200000, 60),
(2, 'Uốn tóc', 'Uốn nóng/lạnh theo yêu cầu', 800000, 150),
(2, 'Gội đầu dưỡng sinh', 'Massage đầu cổ vai gáy', 120000, 45),
(2, 'Massage body', 'Massage thư giãn toàn thân', 400000, 90),
(3, 'Sơn gel', 'Sơn gel bền màu', 180000, 45),
(3, 'Nail art', 'Vẽ họa tiết theo mẫu', 300000, 75),
(3, 'Chăm sóc móng chân', 'Ngâm, tẩy da chết, sơn', 250000, 60);

INSERT INTO beauticians (salon_id, name, specialty, avatar_url) VALUES
(1, 'Nguyễn Thu Hà', 'Tạo mẫu tóc', 'https://i.pravatar.cc/150?img=47'),
(1, 'Trần Minh Anh', 'Chăm sóc da', 'https://i.pravatar.cc/150?img=45'),
(2, 'Lê Phương Linh', 'Uốn - nhuộm', 'https://i.pravatar.cc/150?img=44'),
(2, 'Phạm Ngọc Mai', 'Massage trị liệu', 'https://i.pravatar.cc/150?img=49'),
(3, 'Hoàng Bảo Trâm', 'Nail art', 'https://i.pravatar.cc/150?img=32'),
(3, 'Võ Khánh Vy', 'Chăm sóc móng', 'https://i.pravatar.cc/150?img=26');

INSERT INTO consultants (salon_id, name, specialty, phone, email, avatar_url) VALUES
(1, 'Đặng Thanh Tâm', 'Tư vấn dịch vụ tóc & da', '0905 123 456', 'tam@lotus.vn', 'https://i.pravatar.cc/150?img=5'),
(2, 'Bùi Hồng Nhung', 'Tư vấn liệu trình spa', '0905 222 333', 'nhung@rose.vn', 'https://i.pravatar.cc/150?img=9'),
(3, 'Ngô Diệu Linh', 'Tư vấn mẫu nail', '0905 444 555', 'linh@prettynails.vn', 'https://i.pravatar.cc/150?img=16'),
(NULL, 'Chuyên viên tổng đài', 'Hỗ trợ đặt lịch toàn hệ thống', '1900 1234', 'hotro@salon.vn', 'https://i.pravatar.cc/150?img=12');
