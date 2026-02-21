MedLink360 — AI Powered Doctor Appointment Platform

A full-stack healthcare appointment ecosystem where patients, doctors, and admin interact in one system, enhanced with an ML-based specialist recommendation engine.

The platform not only books appointments — it also helps users who don’t know which doctor to visit by predicting the correct specialist from symptoms.

🌐 Live Deployment

User App: https://medlink360-frontend.onrender.com

Admin Panel: https://medlink360-admin.onrender.com

Backend API: https://medlink-backend-2bgo.onrender.com

ML_URL: https://medlink360.onrender.com

🧠 Core Idea

Traditional hospital apps assume users already know the correct specialist.

MedLink360 workflow

Select Symptoms → AI predicts specialist → Show matching doctors → Book instantly

So the platform acts as both:

Appointment Booking System

AI Medical Triage Assistant



Flow:

User Symptoms → Backend → ML Model → Specialist → DB Doctors → UI Recommendations

👥 Roles & Features

👤 Patient

Register / Login

Browse doctors

Book appointment

Cancel appointment

View appointment history

Online payment (Razorpay)

AI doctor recommendation

🧑‍⚕️ Doctor

Login dashboard

View patient bookings

Mark appointment complete

Cancel unpaid bookings

Update profile

Track earnings

🛠️ Admin

Add doctor

Change doctor availability

View all appointments

Cancel bookings

Dashboard analytics

🤖 AI Health Assistant

Select symptoms

Predict specialist

Show correct doctors

Prevent wrong bookings

🧰 Tech Stack
Frontend

React (Vite)

Context API

Axios

Tailwind CSS

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Multer

Cloudinary

Payment

Razorpay Integration

Machine Learning

Python

FastAPI

Scikit-learn

Joblib model serving

📡 API Routes
Admin ->/api/admin

POST	/login	Admin login

POST	/add-doctor	Add doctor

GET	/all-doctor	Get all doctors

PATCH	/change-availability/:id	Toggle availability

GET	/appointments	All bookings

POST	/cancel-appointment	Cancel booking

GET	/dashboard	Stats

Doctor -> /api/doctor

GET	/list	Public doctor list

POST	/login	Doctor login

GET	/appointments	Doctor bookings

POST	/complete-appointment	Mark complete

POST	/cancel-appointment	Cancel unpaid

GET	/dashboard	Earnings

GET	/profile	Doctor profile

POST	/update-profile	Update profile

User -> /api/user

POST	/register	Register

POST	/login	Login

GET	/get-profile	Profile

POST	/update-profile	Update profile

POST	/book-appointment	Book doctor

GET	/appointments	Appointment history
POST	/cancel-appointment	Cancel
POST	/payment-razorpay	Create order
POST	/verifyRazorpay	Verify payment
AI Recommendation /api/ai-recommend

