# 🚀 Team Task Manager (SaaS Project)

A full-stack **role-based task and project management system** built using **React (Frontend)** and **Flask (Backend API)**.  
Deployed using **Vercel (Frontend)** and **Railway (Backend)**.

---

## 🌐 Live Demo

- 🔗 Frontend: [https://your-vercel-link.vercel.app](https://team-task-manager-self-ten.vercel.app/](https://team-task-manager-self-ten.vercel.app/)
- 🔗 Backend API: https://zoological-art-production-640b.up.railway.app  

---

## ✨ Features

### 👤 Authentication
- User Signup & Login
- JWT Authentication
- Role-based access (Admin / Member)

---

### 📁 Project Management
- Admin can create projects
- Admin assigns members to projects
- Members can only access assigned projects

---

### 📌 Task Management
- Create tasks inside projects
- Assign tasks to users
- Update task status:
  - Pending
  - Done
- Delete tasks (Admin only)

---

### 👑 Admin Panel
- View all users
- Add users to projects
- Manage project access

---

### 📊 Dashboard
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks

---

## 🛠 Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM

### Backend
- Flask
- Flask-JWT-Extended
- Flask-SQLAlchemy
- Flask-CORS

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

## 📂 Project Structure
team-task-manager/
│
├── backend/
│ ├── app/
│ ├── routes/
│ ├── models/
│ ├── run.py
│
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── services/api.js
│
└── README.md



---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
pip install -r requirements.txt
python run.py
