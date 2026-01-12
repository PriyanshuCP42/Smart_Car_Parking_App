# 🚗 Smart Car Parking System – Full Stack 4 Role-Based Application

A real-world **smart valet parking management system** with complete business workflow, multi-role access, controlled driver onboarding, live parking & retrieval flow, and WhatsApp notifications.

---

## ⚙️ Tech Stack
- ⚛️ React.js – Frontend  
- 🟢 Node.js – Backend  
- 🚂 Express.js – API Layer  
- 🐘 PostgreSQL (Supabase) – Database  
- 🔗 Prisma – ORM  
- 🔐 JWT – Authentication  
- 🔒 Bcrypt – Password Hashing  
- 📲 WhatsApp Popup Alerts – Notifications  

---

## 👥 Roles in System
- 👤 **User** – Park car, retrieve car  
- 👨‍💼 **Manager** – Onboard drivers, manage operations  
- 🚗 **Driver** – Park & retrieve vehicles  
- 🛡 **Super Admin** – Approve/reject drivers, view analytics  

---

## 🔐 Authentication & Access
- 📝 User & Manager **can signup directly**
- 🚫 Driver **cannot self-signup**
- 👨‍💼 Manager creates driver with **email + password**
- 🚗 Driver logs in using same credentials after approval
- 🛡 All routes protected using **JWT + Role Guards**

---

## 👨‍✈️ Driver Onboarding Flow
- 👨‍💼 Manager → Add Driver (Email + Password)
- ⏳ Driver Status → **PENDING**
- 📤 Request sent to **Super Admin**
- 🛡 Super Admin → **Approve / Reject**
- ✅ Approved → Driver can take tasks
- ❌ Rejected → Driver blocked

---

## 🚘 User Parking Flow (Scan to Park)
- 📱 User opens app
- 📷 Clicks **Scan to Park**
- 🚗 Registers vehicle
- 📄 Views car details
- 🎫 Generates ticket
- 📲 WhatsApp popup → **Ticket Generated**
- 📤 Parking request sent to Driver

---

## 🚗 Driver Parking Flow
- 📥 Parking request appears on Driver Dashboard
- ✅ Driver accepts task
- 🅿️ Driver parks car
- 📲 WhatsApp popup → **Car Parked Successfully**

---

## 🔁 User Retrieval Flow (Get My Car)
- 📱 User clicks **Get My Car**
- 📤 Retrieval request sent to Driver
- 🚗 Driver retrieves car
- 📦 Driver delivers car to user
- 📲 WhatsApp popup → **Car Delivered Successfully**
- 🧹 Active ticket removed from User Dashboard

---

## 📊 Manager & Super Admin Dashboard
- 📈 Total tickets count  
- 🅿️ Active parkings  
- 💰 Revenue generated  
- 🚗 Drivers working  
- ⏳ Pending requests  

---

## 🧠 System Flow
- 📱 User App  
- ⬇️  
- 🖥 Backend (Express + JWT)  
- ⬇️  
- 🔗 Prisma ORM  
- ⬇️  
- 🐘 Supabase PostgreSQL  
- ⬇️  
- 👨‍💼 Manager Dashboard | 🚗 Driver Dashboard | 🛡 Super Admin Dashboard  

---

## 🔐 Security
- 🔑 JWT based authentication  
- 🔒 Bcrypt hashed passwords  
- 🚫 Role-based access control  
- 🛡 No driver works without Super Admin approval  

---

## 🏆 Why This Project is Strong
- ✅ Real business workflow (not CRUD)
- ✅ Multi-level approval system
- ✅ Role-based architecture
- ✅ Secure authentication
- ✅ Scalable backend design
- ✅ Production-ready logic

---

## 🚀 Run Locally
- 📁 Backend  
  - `npm install`  
  - `npx prisma generate`  
  - `npx prisma migrate dev`  
  - `npm run dev`  

- 📁 Frontend  
  - `npm install`  
  - `npm run dev`

    
## 🛠 Built By
**Priyanshu Agrahari ** – Full Stack Developer 🚀

