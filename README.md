# Prescripto — AI Powered Doctor Appointment & Tele-Consultation Platform

Prescripto is a full-stack healthcare platform that combines appointment booking, real-time tele-consultation and an AI triage engine to guide patients to the correct medical specialist before booking.

Unlike traditional hospital systems where users must manually choose a doctor, Prescripto predicts the appropriate specialist from symptoms and automatically suggests relevant doctors.

---

## 🌐 Live Deployment

* User App: https://medlink360-frontend.onrender.com
* Admin Panel: https://medlink360-admin.onrender.com
* Backend API: https://medlink-backend-2bgo.onrender.com
* AI Service: https://medlink360.onrender.com

---

## 🧠 Problem Statement

Patients frequently book the wrong specialist due to lack of medical knowledge, resulting in:

* incorrect appointments
* longer diagnosis cycles
* hospital congestion
* repeated bookings

Prescripto introduces an **AI medical triage layer** before booking.

### System Flow

```
User Symptoms → Backend API → ML Model → Predicted Specialist
               ↓
        Matching Doctors → Instant Booking → Consultation
```

The platform therefore acts as both:

1. Appointment Booking System
2. AI Medical Triage Assistant

---

## 👥 System Roles

### 👤 Patient

* Authentication (JWT)
* AI-based specialist prediction
* Doctor recommendations
* Book / cancel appointments
* Razorpay payment integration
* Appointment history
* Real-time chat & video consultation

### 🧑‍⚕️ Doctor

* Secure dashboard login
* Live consultation room (WebRTC)
* Chat with patient
* Mark appointment complete
* Cancel unpaid bookings
* Update availability & profile
* Earnings dashboard

### 🛠️ Admin

* Add / manage doctors
* Toggle availability
* Monitor all appointments
* Cancel bookings
* Analytics dashboard

---

## 🤖 AI Recommendation Engine

Users select symptoms instead of manually choosing departments.

```
Symptoms → ML Model → Specialist → Doctor List
```

Model prevents incorrect booking and reduces hospital triage workload.

Model served via FastAPI inference server.

---

## 🏗️ Architecture

### High Level Architecture

```
Frontend (React)
       ↓
Node.js API Server
       ↓
MongoDB Database
       ↓
FastAPI ML Service
       ↓
Socket.IO Signaling Server
       ↓
WebRTC Peer-to-Peer Call
```

### Realtime Consultation Logic

Server maintains authoritative room state.

* Doctor joins + Patient joins → `room-ready`
* Only then call allowed
* Prevents ghost calls & duplicate peers
* Automatic disconnect handling

---

## 🧰 Tech Stack

### Frontend

* React (Vite)
* Context API state management
* Tailwind CSS
* Socket.IO client
* WebRTC media handling

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Cloudinary media storage
* Multer uploads

### Realtime

* Socket.IO signaling
* WebRTC peer-to-peer video calling
* ICE/STUN negotiation

### Payments

* Razorpay order + verification

### Machine Learning

* Python FastAPI inference server
* Scikit-learn classification model
* Joblib serialized model

---

## 📡 REST API Structure

### Admin `/api/admin`

| Method | Route                    | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | /login                   | Admin login         |
| POST   | /add-doctor              | Add doctor          |
| GET    | /all-doctor              | List doctors        |
| PATCH  | /change-availability/:id | Toggle availability |
| GET    | /appointments            | All bookings        |
| POST   | /cancel-appointment      | Cancel booking      |
| GET    | /dashboard               | Analytics           |

### Doctor `/api/doctor`

| Method | Route                 | Description     |
| ------ | --------------------- | --------------- |
| POST   | /login                | Doctor login    |
| GET    | /appointments         | Doctor bookings |
| POST   | /complete-appointment | Mark complete   |
| POST   | /cancel-appointment   | Cancel unpaid   |
| GET    | /dashboard            | Earnings        |
| GET    | /profile              | Doctor profile  |
| POST   | /update-profile       | Update profile  |

### User `/api/user`

| Method | Route               | Description    |
| ------ | ------------------- | -------------- |
| POST   | /register           | Register       |
| POST   | /login              | Login          |
| GET    | /get-profile        | Profile        |
| POST   | /update-profile     | Update profile |
| POST   | /book-appointment   | Book           |
| GET    | /appointments       | History        |
| POST   | /cancel-appointment | Cancel         |
| POST   | /payment-razorpay   | Create order   |
| POST   | /verifyRazorpay     | Verify payment |

### AI Recommendation `/api/ai-recommend`

| Method | Route    | Description                      |
| ------ | -------- | -------------------------------- |
| POST   | /predict | Predict specialist from symptoms |

---

## ⚙️ Local Setup

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

### Admin

```
cd admin
npm install
npm run dev
```

### AI Server

```
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔐 Environment Variables

Create `.env` files using `.env.example`

---

## Key Engineering Highlights

* Authoritative real-time consultation room state
* Duplicate message prevention
* Secure role-based JWT authorization
* Payment verification workflow
* ML inference microservice architecture
* Peer-to-peer WebRTC video consultation

---
