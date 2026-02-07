# 📚 คู่มือโปรเจค Ud Hotel Finder

## 📋 สารบัญ
1. [ข้อมูลทั่วไป](#ข้อมูลทั่วไป)
2. [สถาปัตยกรรมโปรเจค](#สถาปัตยกรรมโปรเจค)
3. [การตั้งค่าและการติดตั้ง](#การตั้งค่าและการติดตั้ง)
4. [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
5. [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
6. [API Endpoints](#api-endpoints)
7. [ฐานข้อมูล](#ฐานข้อมูล)
8. [การพัฒนา](#การพัฒนา)

---

## 🎯 ข้อมูลทั่วไป

### ชื่อโปรเจค
**Ud Hotel** - แอปพลิเคชันค้นหาและรีวิวโรงแรม

### วัตถุประสงค์
เป็นแพลตฟอร์มออนไลน์ที่ช่วยให้ผู้ใช้:
- ค้นหาและดูข้อมูลโรงแรม
- ดูรีวิว ระดับคะแนน และความเห็นของผู้อื่น
- เพิ่มโรงแรมที่ชื่นชอบลงในรายการโปรด
- เขียนและแก้ไขรีวิวของตัวเอง
- สำหรับผู้ดูแลระบบ: จัดการโรงแรม ประกาศ และกิจกรรมผู้ใช้

### เทคโนโลยีที่ใช้
**Frontend (Client):**
- React 18.2 + Vite
- React Router v6
- Tailwind CSS
- Leaflet (แสดงแผนที่)
- Recharts (แสดงกราฟ)
- Axios (HTTP requests)

**Backend (Server):**
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- Nodemailer (ส่งอีเมล)
- Multer (อัปโหลดไฟล์)

---

## 🏗️ สถาปัตยกรรมโปรเจค

```
┌─────────────────────────────────────┐
│     Frontend (React + Vite)         │
│  - Pages & Components               │
│  - Authentication Context           │
│  - Language Support (EN/TH)         │
└────────────┬────────────────────────┘
             │ (Axios HTTP Requests)
             ↓
┌─────────────────────────────────────┐
│    Backend (Express.js Server)      │
│  - API Routes & Controllers         │
│  - JWT Authentication               │
│  - Database Models                  │
│  - Business Logic                   │
└────────────┬────────────────────────┘
             │ (Sequelize ORM)
             ↓
┌─────────────────────────────────────┐
│     MySQL Database                  │
│  - Users, Hotels, Reviews           │
│  - Favorites, Announcements         │
│  - Activity Logs                    │
└─────────────────────────────────────┘
```

---

## 🚀 การตั้งค่าและการติดตั้ง

### ข้อกำหนดเบื้องต้น
- **Node.js** เวอร์ชัน 14 ขึ้นไป
- **MySQL** เวอร์ชัน 5.7 ขึ้นไป
- **npm** หรือ **yarn**

### ขั้นตอนการติดตั้ง

#### 1. Clone และ Setup Database
```bash
# เข้าไปยังโหลดของการกำหนดค่า
cd server
```

สร้างไฟล์ `.env` ในโฟลเดอร์ `server`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ud_hotels
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

#### 2. ติดตั้ง Backend Dependencies
```bash
cd server
npm install
npm run seed  # สร้างข้อมูลตัวอย่าง
npm run dev   # เริ่มเซิร์ฟเวอร์
```

#### 3. ติดตั้ง Frontend Dependencies
```bash
cd client
npm install
npm run dev  # เริ่มแอปพลิเคชัน
```

#### 4. เข้าใช้งาน
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

## 📁 โครงสร้างโปรเจค

### Client (Frontend)
```
client/
├── src/
│   ├── App.jsx                 # แอปพลิเคชันหลัก
│   ├── main.jsx                # Entry point
│   ├── index.css               # CSS global
│   ├── components/             # React Components
│   │   ├── Navbar.jsx
│   │   ├── HotelCard.jsx
│   │   ├── HotelForm.jsx
│   │   ├── HotelMap.jsx
│   │   ├── HotelMapPicker.jsx
│   │   ├── Review.jsx
│   │   ├── ActivityLog.jsx
│   │   ├── AnnouncementManagement.jsx
│   │   ├── AnnouncementPopup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── ThemeSwitcher.jsx
│   │   ├── UserManagement.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Footer.jsx
│   │   └── admin/              # Admin Components
│   ├── pages/                  # Route Pages
│   │   ├── HomePage.jsx
│   │   ├── HotelDetailPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── MyReviewsPage.jsx
│   │   ├── FavoritesPage.jsx
│   │   └── AdminPage.jsx
│   ├── services/
│   │   └── api.js              # API configuration
│   ├── context/                # React Context
│   │   ├── AuthContext.jsx     # Authentication
│   │   └── LanguageContext.jsx # Multi-language
│   └── locales/                # Translation files
│       ├── en.json             # English
│       └── th.json             # Thai
├── public/                     # Static files
└── vite.config.js             # Vite configuration
```

### Server (Backend)
```
server/
├── server.js                   # Entry point
├── config/
│   └── database.js             # Database configuration
├── models/                     # Database Models
│   ├── User.js
│   ├── Hotel.js
│   ├── Review.js
│   ├── Favorite.js
│   ├── Announcement.js
│   ├── ActivityLog.js
│   └── index.js                # Model relationships
├── controllers/                # Business Logic
│   ├── authController.js
│   ├── hotelController.js
│   ├── reviewController.js
│   ├── favoriteController.js
│   ├── announcementController.js
│   ├── adminController.js
│   ├── dashboardController.js
│   └── activityLogController.js
├── routes/                     # API Routes
│   ├── auth.js
│   ├── hotels.js
│   ├── reviews.js
│   ├── favorites.js
│   ├── announcements.js
│   ├── admin.js
│   ├── dashboard.js
│   └── activityLogs.js
├── middleware/                 # Middleware
│   ├── auth.js                 # JWT authentication
│   └── upload.js               # File upload
├── services/
│   └── emailService.js         # Email sending
├── seeds/
│   └── seedDB.js               # Database seeding
├── uploads/                    # Uploaded files
└── db/                         # Database files (if needed)
```

---

## ✨ ฟีเจอร์หลัก

### 🔐 ระบบการรับรองความถูกต้อง (Authentication)
- **Register**: สมัครสมาชิกใหม่
- **Login**: เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
- **Forgot Password**: รีเซ็ตรหัสผ่านผ่านอีเมล
- **JWT Token**: ความปลอดภัยด้วย JWT Token
- **Role-based Access**: สมาชิก vs ผู้ดูแลระบบ

### 🏨 ระบบบัญชีโรงแรม (Hotel Management)
- **ค้นหาโรงแรม**: ค้นหาตามชื่อ, ตำแหน่งที่ตั้ง, ราคา
- **แสดงรายละเอียด**: ข้อมูล รูปภาพ, แผนที่, ระดับคะแนน
- **แสดงแผนที่**: ใช้ Leaflet แสดงตำแหน่งที่ตั้ง
- **จัดการโรงแรม** (Admin): เพิ่ม, แก้ไข, ลบข้อมูลโรงแรม

### ⭐ ระบบรีวิว (Review System)
- **เขียนรีวิว**: เพิ่มคะแนน, ความเห็น, วันที่
- **ดูรีวิว**: เรียงตามความเกี่ยวข้องหรือวันที่
- **แก้ไขรีวิว**: แก้ไขรีวิวของตัวเอง
- **ลบรีวิว**: ลบรีวิวที่เจ้าหนึ่ง
- **คะแนนเฉลี่ย**: คำนวณและแสดงคะแนนเฉลี่ย

### ❤️ ระบบโปรด (Favorites)
- **เพิ่มโปรด**: บันทึกโรงแรมที่ชื่นชอบ
- **ลบโปรด**: ลบจากรายการโปรด
- **ดูรายการโปรด**: หน้าเฉพาะสำหรับรายการโปรด

### 📢 ระบบประกาศ (Announcements)
- **สร้างประกาศ** (Admin): ส่งข่าวสาร/อัปเดต
- **แสดงประกาศ**: Pop-up หรือหน้าข่าวสาร
- **จัดการประกาศ** (Admin): แก้ไข, ลบ, อัปโหลดรูปภาพ

### 📊 แดชบอร์ด Admin
- **สถิติโรงแรม**: จำนวน ระดับคะแนน ผู้เข้าชม
- **สถิติผู้ใช้**: จำนวนผู้ใช้, ผู้ใช้ที่ใช้งาน
- **บันทึกกิจกรรม**: ประวัติการกระทำของผู้ใช้
- **จัดการผู้ใช้**: ดูข้อมูล, ระงับบัญชี

### 🌐 หลายภาษา (Multi-language)
- **ภาษาอังกฤษ** (English)
- **ภาษาไทย** (Thai)
- **Language Switcher**: เปลี่ยนภาษาได้ตลอดเวลา

### 🎨 ธีม (Theme)
- **Light Mode**: ธีมสว่าง
- **Dark Mode**: ธีมมืด
- **Theme Switcher**: เปลี่ยนธีมได้ตลอดเวลา

---

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register              # สมัครสมาชิก
POST   /login                 # เข้าสู่ระบบ
POST   /forgot-password       # ขอรีเซ็ตรหัสผ่าน
POST   /reset-password        # รีเซ็ตรหัสผ่าน
GET    /me                    # ดึงข้อมูลผู้ใช้ปัจจุบัน (ต้อง Auth)
```

### Hotel Routes (`/api/hotels`)
```
GET    /                      # ดึงรายชื่อโรงแรมทั้งหมด
GET    /:id                   # ดึงรายละเอียดโรงแรม
GET    /:id/reviews           # ดึงรีวิวของโรงแรม
POST   /                      # สร้างโรงแรมใหม่ (Admin)
PUT    /:id                   # แก้ไขข้อมูลโรงแรม (Admin)
DELETE /:id                   # ลบโรงแรม (Admin)
```

### Review Routes (`/api/reviews`)
```
GET    /                      # ดึงรีวิวทั้งหมด
GET    /:id                   # ดึงรีวิวตามนำ
POST   /                      # สร้างรีวิวใหม่
PUT    /:id                   # แก้ไขรีวิว
DELETE /:id                   # ลบรีวิว
```

### Favorite Routes (`/api/favorites`)
```
GET    /                      # ดึงรายการโปรด
POST   /                      # เพิ่มเข้ารายการโปรด
DELETE /:id                   # ลบจากรายการโปรด
```

### Admin Routes (`/api/admin`)
```
GET    /users                 # ดึงรายชื่อผู้ใช้
GET    /stats                 # ดึงสถิติต่างๆ
GET    /activity-logs         # ดึงบันทึกกิจกรรม
PUT    /users/:id             # แก้ไขข้อมูลผู้ใช้
DELETE /users/:id             # ลบบัญชีผู้ใช้
```

### Announcement Routes (`/api/announcements`)
```
GET    /                      # ดึงประกาศทั้งหมด
POST   /                      # สร้างประกาศ (Admin)
PUT    /:id                   # แก้ไขประกาศ (Admin)
DELETE /:id                   # ลบประกาศ (Admin)
```

### Dashboard Routes (`/api/dashboard`)
```
GET    /stats                 # ดึงสถิติแดชบอร์ด
GET    /charts                # ดึงข้อมูลสำหรับกราฟ
```

---

## 💾 ฐานข้อมูล

### ตารางหลัก

#### users
```sql
- id (PK)
- email (UNIQUE)
- password (hashed)
- fullName
- phone
- role (user/admin)
- createdAt
- updatedAt
```

#### hotels
```sql
- id (PK)
- name
- description
- location
- address
- latitude
- longitude
- pricePerNight
- amenities (JSON)
- image (URL)
- rating (calculated)
- reviewCount
- createdAt
- updatedAt
```

#### reviews
```sql
- id (PK)
- userId (FK)
- hotelId (FK)
- rating (1-5)
- comment
- createdAt
- updatedAt
```

#### favorites
```sql
- id (PK)
- userId (FK)
- hotelId (FK)
- createdAt
```

#### announcements
```sql
- id (PK)
- title
- content
- image (URL)
- createdAt
- updatedAt
```

#### activityLogs
```sql
- id (PK)
- userId (FK)
- action (description)
- timestamp
```

---

## 🛠️ การพัฒนา

### คำสั่ง Frontend
```bash
cd client

# เริ่มเซิร์ฟเวอร์พัฒนา
npm run dev

# Build สำหรับ production
npm run build

# Preview production build
npm run preview
```

### คำสั่ง Backend
```bash
cd server

# เริ่มเซิร์ฟเวอร์พัฒนา (ด้วย nodemon)
npm run dev

# เริ่มเซิร์ฟเวอร์ production
npm start

# สร้างข้อมูลตัวอย่าง
npm run seed
```

### สิ่งที่ควรทำเมื่อเริ่มพัฒนา
1. ✅ ตั้งค่า `.env` ให้ถูกต้อง
2. ✅ ตรวจสอบการเชื่อมต่อ MySQL
3. ✅ รัน `npm run seed` สำหรับข้อมูลตัวอย่าง
4. ✅ เริ่ม Backend: `npm run dev` (จากโฟลเดอร์ server)
5. ✅ เริ่ม Frontend: `npm run dev` (จากโฟลเดอร์ client)
6. ✅ เปิด `http://localhost:5173` เพื่อดูแอป

### Error Handling
- **404 Not Found**: ตรวจสอบ URL endpoint
- **CORS Error**: ตรวจสอบการตั้งค่า CORS ในเซิร์ฟเวอร์
- **Database Connection**: ตรวจสอบ MySQL running และรหัสผ่าน .env
- **JWT Token**: ตรวจสอบว่า token ยังไม่หมดอายุ

---

## 📝 หมายเหตุเพิ่มเติม

### Best Practices ในการพัฒนา
1. **Authentication**: ใช้ JWT Token สำหรับ secure requests
2. **Validation**: ตรวจสอบข้อมูลทั้ง Client และ Server
3. **Error Handling**: จัดการข้อผิดพลาดอย่างเหมาะสม
4. **Logging**: บันทึกกิจกรรมสำคัญ
5. **Security**: ใช้ bcrypt สำหรับรหัสผ่าน

### โฟลเดอร์ uploads
- เก็บรูปภาพที่อัปโหลดจากการจัดการประกาศ
- ตรวจสอบสิทธิ์เมื่ออัปโหลด

### Seeds Data
- ไฟล์ `seedDB.js` มีข้อมูลตัวอย่างสำหรับทดสอบ
- รัน `npm run seed` เพื่อสร้างข้อมูล

---

## 🎓 สรุป

**Ud Hotel Finder** เป็นแอปพลิเคชันที่สมบูรณ์สำหรับการค้นหาและรีวิวโรงแรม ประกอบไปด้วย:
- ✅ Frontend React ที่ทันสมัย
- ✅ Backend Express.js ที่เข้มแข็ง
- ✅ ฐานข้อมูล MySQL ที่ดีต่อ
- ✅ ระบบการรักษาความปลอดภัย
- ✅ หลายภาษาและธีมที่ยืดหยุ่น

สำหรับข้อมูลเพิ่มเติม ให้ติดต่อผู้พัฒนาหรือดูในโค้ดที่มีคำอธิบายอยากอย่างละเอียด!

---

**เอกสารนี้ถูกสร้างขึ้นเพื่อช่วยในการเข้าใจและการพัฒนาโปรเจค**
