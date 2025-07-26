# LMS - Learning Management System

Hệ thống quản lý học tập dành cho các trung tâm giáo dục, hỗ trợ quản lý phụ huynh, học sinh, lớp học và gói học.

## 🚀 Tech Stack

### Frontend

- **React 19** với TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **React Hook Form** + **Zod** - Form validation
- **Lucide React** - Icons
- **Radix UI** - UI Components

### Backend

- **Node.js** + **Express.js**
- **MongoDB** với **Mongoose**
- **JWT** - Authentication
- **Helmet** - Security
- **CORS** - Cross-origin requests

### DevOps

- **Docker** + **Docker Compose**
- **MongoDB Atlas** - Cloud database

## 📋 Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **Docker** + **Docker Compose** (khuyến nghị)
- **MongoDB Atlas** account (hoặc MongoDB local)

## 🛠️ Cài đặt và chạy

### Cách 1: Sử dụng Docker (Khuyến nghị)

1. **Clone repository**

```bash
git clone <repository-url>
cd lms-project
```

2. **Chạy với Docker Compose**

```bash
# Production mode
docker-compose up --build

# Development mode
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
```

3. **Truy cập ứng dụng**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health check: http://localhost:5000/health

### Cách 2: Chạy manual

1. **Setup Backend**

```bash
cd backend
npm install
npm run dev
```

2. **Setup Frontend**

```bash
cd frontend
npm install
npm run dev
```

3. **Tạo dữ liệu mẫu**

```bash
cd backend
npm run seed
```

## 🗄️ Database Schema

### Collections chính:

#### 1. **Parents** (Phụ huynh)

```javascript
{
  _id: ObjectId,
  name: String,        // Họ và tên
  phone: String,       // Số điện thoại
  email: String,       // Email
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **Students** (Học sinh)

```javascript
{
  _id: ObjectId,
  name: String,           // Họ và tên
  dob: Date,             // Ngày sinh
  gender: String,        // "male" | "female" | "other"
  current_grade: String, // Lớp hiện tại
  parent_id: ObjectId,   // Ref: Parents
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **Classes** (Lớp học)

```javascript
{
  _id: ObjectId,
  name: String,          // Tên lớp
  subject: String,       // Môn học
  day_of_week: String,   // "monday" -> "sunday"
  time_slot: {
    start_time: String,  // "09:00"
    end_time: String     // "10:30"
  },
  teacher_name: String,  // Tên giáo viên
  max_students: Number,  // Sỉ số tối đa
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **ClassRegistrations** (Đăng ký lớp học)

```javascript
{
  _id: ObjectId,
  class_id: ObjectId,      // Ref: Classes
  student_id: ObjectId,    // Ref: Students
  registration_date: Date,
  status: String,          // "active" | "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **SubscriptionPackages** (Gói dịch vụ)

```javascript
{
  _id: ObjectId,
  name: String,         // Tên gói
  description: String,  // Mô tả
  total_sessions: Number, // Tổng số buổi học
  duration_days: Number,  // Thời hạn (ngày)
  price: Number,        // Giá
  status: String,       // "active" | "inactive"
  createdAt: Date,
  updatedAt: Date
}
```

#### 6. **Subscriptions** (Gói học đã mua)

```javascript
{
  _id: ObjectId,
  student_id: ObjectId,     // Ref: Students
  package_id: ObjectId,     // Ref: SubscriptionPackages
  start_date: Date,         // Ngày bắt đầu
  end_date: Date,           // Ngày kết thúc
  total_sessions: Number,   // Tổng số buổi
  used_sessions: Number,    // Số buổi đã sử dụng
  status: String,           // "active" | "expired" | "cancelled"
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Parents (Phụ huynh)

```bash
# Lấy tất cả phụ huynh
GET /api/v1/parents

# Tạo phụ huynh mới
POST /api/v1/parents
Content-Type: application/json
{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "nguyenvana@email.com"
}

# Lấy thông tin phụ huynh theo ID
GET /api/v1/parents/:id

# Cập nhật thông tin phụ huynh
PUT /api/v1/parents/:id
Content-Type: application/json
{
  "name": "Nguyễn Văn A (Updated)",
  "phone": "0901234567"
}

# Xóa phụ huynh
DELETE /api/v1/parents/:id
```

### Students (Học sinh)

```bash
# Lấy tất cả học sinh
GET /api/v1/students

# Tạo học sinh mới
POST /api/v1/students
Content-Type: application/json
{
  "name": "Nguyễn Văn B",
  "dob": "2010-05-15",
  "gender": "male",
  "current_grade": "Lớp 8",
  "parent_id": "64f5e8c9a1b2c3d4e5f6a7b8"
}

# Lấy học sinh theo phụ huynh
GET /api/v1/students/parent/:parentId

# Lấy học sinh theo lớp
GET /api/v1/students/grade/Lớp%208
```

### Classes (Lớp học)

```bash
# Lấy tất cả lớp học
GET /api/v1/classes

# Lấy lớp học theo ngày
GET /api/v1/classes?day=monday

# Tạo lớp học mới
POST /api/v1/classes
Content-Type: application/json
{
  "name": "Toán 8A",
  "subject": "Toán học",
  "day_of_week": "monday",
  "time_slot": {
    "start_time": "09:00",
    "end_time": "10:30"
  },
  "teacher_name": "Cô Lan",
  "max_students": 15
}

# Đăng ký học sinh vào lớp
POST /api/v1/classes/:classId/register
Content-Type: application/json
{
  "student_id": "64f5e8c9a1b2c3d4e5f6a7b9"
}

# Lấy danh sách học sinh trong lớp
GET /api/v1/classes/:classId/students
```

### Subscription Packages (Gói dịch vụ)

```bash
# Lấy tất cả gói dịch vụ
GET /api/v1/subscription-packages

# Lấy gói đang hoạt động
GET /api/v1/subscription-packages?status=active

# Tạo gói dịch vụ mới
POST /api/v1/subscription-packages
Content-Type: application/json
{
  "name": "Gói học 20 buổi",
  "description": "Gói học cơ bản cho học sinh",
  "total_sessions": 20,
  "duration_days": 90,
  "price": 2000000
}
```

### Subscriptions (Gói học)

```bash
# Lấy tất cả gói học
GET /api/v1/lms-subscriptions

# Tạo gói học cho học sinh
POST /api/v1/lms-subscriptions
Content-Type: application/json
{
  "student_id": "64f5e8c9a1b2c3d4e5f6a7b9",
  "package_id": "64f5e8c9a1b2c3d4e5f6a7ba",
  "start_date": "2024-01-15"
}

# Lấy gói học của học sinh
GET /api/v1/lms-subscriptions/student/:studentId

# Lấy gói học đang hoạt động của học sinh
GET /api/v1/lms-subscriptions/student/:studentId/active

# Sử dụng một buổi học
PATCH /api/v1/lms-subscriptions/:subscriptionId/use

# Hủy gói học
PATCH /api/v1/lms-subscriptions/:subscriptionId/cancel
```

## 🎯 Tính năng chính

### 👥 Quản lý Phụ huynh & Học sinh

- Thêm, sửa, xóa thông tin phụ huynh
- Quản lý danh sách học sinh theo phụ huynh
- Theo dõi thông tin học sinh (lớp, ngày sinh, giới tính)

### 📚 Quản lý Lớp học

- Tạo lớp học theo thời khóa biểu tuần
- Đăng ký học sinh vào lớp
- Kiểm soát sỉ số tối đa mỗi lớp
- Xem lịch học theo ngày trong tuần

### 📦 Quản lý Gói học

- Tạo các gói dịch vụ với số buổi học và thời hạn
- Mua gói học cho học sinh
- Theo dõi số buổi học đã sử dụng/còn lại
- Tự động cập nhật trạng thái gói học

### 📊 Dashboard & Báo cáo

- Thống kê tổng quan hệ thống
- Theo dõi tình trạng lớp học
- Báo cáo sử dụng gói học
- Hoạt động gần đây

## 🔧 Cấu hình

### Environment Variables

**Backend (.env)**

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-jwt-secret
```

**Frontend (.env)**

```bash
VITE_API_URL=http://localhost:5000
```

## 📱 Responsive Design

- ✅ Mobile-first approach
- ✅ Tablet optimization
- ✅ Desktop enhancement
- ✅ Touch-friendly interface

## 🚦 Development

### Scripts hữu ích

**Backend**

```bash
npm run dev          # Chạy development server
npm run start        # Chạy production server
npm run seed         # Tạo dữ liệu mẫu
npm run seed:clear   # Xóa và tạo lại dữ liệu
```

**Frontend**

```bash
npm run dev          # Chạy development server
npm run build        # Build production
npm run preview      # Preview production build
npm run lint         # Kiểm tra code style
```

### Health Check

```bash
# Kiểm tra trạng thái server
curl http://localhost:5000/health

# Response
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 120.5,
  "environment": "development"
}
```
