# 🚀 Team Task Manager (SaaS Project)

A full-stack **role-based task and project management system** built using **React (Frontend)** and **Flask (Backend API)**.  
Deployed using **Vercel (Frontend)** and **Railway (Backend)**.

---

## 🌐 Live Demo

- 🔗 Frontend: https://team-task-manager-self-ten.vercel.app/
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


## ⚙️ Setup Instructions

### 🔹 Setup

```bash
### 🔹 (backend)
cd backend
pip install -r requirements.txt
python run.py


### 🔹 (frontend)
cd frontend
npm install
npm start
