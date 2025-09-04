# Crime Tracker

![GitHub Repo Size](https://img.shields.io/github/repo-size/MdFahim85/Crime-Tracker) ![GitHub stars](https://img.shields.io/github/stars/MdFahim85/Crime-Tracker) ![GitHub issues](https://img.shields.io/github/issues/MdFahim85/Crime-Tracker) 

## Description

Welcome to **Crime Tracker**, a **MERN stack application** for reporting, tracking, and analyzing local crimes in real-time. Crime Tracker helps users and administrators **stay informed and take action** by offering:

- **Secure authentication** with JWT & Google OAuth

- **Role-based access control** (User, Admin, Master Admin)

- **Interactive maps and filters** for crime reports

- **Data-driven dashboards** with charts and analytics

  

---


## 🚀 Live Demo

Check out the deployed application here:  

👉 [Crime Tracker Live](https://crime-tracker.onrender.com/)


  

## 🎯 Features

  

### ✅ Authentication & Authorization

- Secure login/registration with **JWT & Google OAuth**

- **Role-based access** for Users, Admins, Master Admin

- Profile picture upload

  
  

### ✅ Homepage

- Displays **6 latest reports**

- Quick **crime stats** and **monthly crime chart**

  

### ✅ Reports & Map

- Interactive map with **filters by crime type, region (5km radius), and date range**

  
  

### ✅ Report Management

- Submit reports with **evidence images**

- Reports require **admin approval** before publishing

  
  

### ✅ Report Download

- Download crime reports in **PDF format**

  
  

### ✅ Pagination

- Efficient browsing of **reports, users, and notifications**

  
  

### ✅ Comments

- Add/delete comments on **approved reports**

  
  

### ✅ User Profile

- User profile update with **profile picture**

- **Analytics bar charts** for report history

- Filter reports by **submitted, pending, approved, rejected**

  
  

### ✅ Notifications

- Notifications for **report approvals/rejections**

- Mark as **read**, **delete**, or view all notifications

  
  

### ✅ Admin Dashboard

- Overview of **total users, reports, pending approvals**

- **Pie charts and monthly reports** for analytics

- Approve/reject reports with feedback, delete reports, promote users to admin, add regions

  
  

### ✅ Master Admin

- Full control, including deleting **any user or admin**

  
  

---

  

## 🛠 Technologies

  

### Frontend

- React.js, Redux-toolkit, TailwindCSS, React Router

  

### Backend

- Node.js, Express.js, MongoDB, JWT, Cloudinary & Multer

  

### Tools & Libraries

- Axios, Mongoose, Leaflet & React Leaflet, Recharts, Zod, ShadCN, React PDF

  

---

  

## ⚡ Getting Started

  

### Prerequisites

- Node.js

- MongoDB (local or cloud)

  

### Installation

```bash

# Clone repository

git clone https://github.com/MdFahim85/Crime-Tracker.git

cd Crime-Tracker

  

# Install backend dependencies

npm install

  

# Install frontend dependencies

cd frontend

npm install

```

  

### Environment Variables

  

#### Backend (`.env` in root)

  

```bash

NODE_ENV=development

  

MONGO_URI=mongodb://localhost:27017/crime-tracker

  

JWT_SECRET=your_jwt_secret GOOGLE_CLIENT_ID=your_client_id

  

CLOUDINARY_CLOUD_NAME=cloudinary_name

  

CLOUDINARY_KEY=cloudinary_key

  

CLOUDINARY_SECRET=cloudinary_secret`

  

```

  

#### Frontend (`.env` inside frontend folder)

```bash

VITE_GOOGLE_CLIENT_ID=your_google_client_id

  

VITE_BACKEND_URL=http://localhost:4000/api

```

### Start Application

  

```bash

npm run dev

  
  

> Runs both backend and frontend concurrently.

  

----------

```

  

## 📁 Folder Structure

  

### Backend

  

``` bash

Cloudinary Config

Controllers

Middlewares

Models

Routes

```

  

### Frontend

  

```bash

public/

public_assets/

src/

├─ Components/

├─ Pages/

├─ Api/

├─ Feature/

└─ App/

```

----------

  

## 🤝 Contributing

  

Contributions, issues, and feature requests are welcome!

  

1. Fork the repository

2. Create a new branch (`git checkout -b feature/YourFeature`)

3. Commit your changes (`git commit -m 'Add new feature'`)

4. Push to the branch (`git push origin feature/YourFeature`)

5. Open a Pull Request

  

----------

  
  

---

  

## 📬 Contact

  

If you have any questions, suggestions, or want to get in touch, feel free to reach out:

  

- **Author**: Md Fahim

- **Email**: [mortuza.aziz.47@gmail.com](mailto:mortuza.aziz.47@gmail.com)

- **GitHub**: [MdFahim85](https://github.com/MdFahim85)

- **LinkedIn**: [MdFahim](https://www.linkedin.com/in/mdfahim85)

- **Portfolio**: [MdFahim](https://mdfahim85.github.io/PortfolioMdFahim/)
