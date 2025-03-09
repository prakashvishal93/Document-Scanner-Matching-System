# 📄 Document Scanning & Matching System

🚀 A self-contained document scanning and matching system with a built-in credit management feature. Users get **20 free scans per day**, and admins can manage extra credit requests. Supports **basic text similarity matching** and **AI-powered matching**

> *An intelligent document matching solution built using Node.js, Express, and SQLite.*  

---


🔗 Deployed Link
- [Document-Scanner-Matching-System](https://cathago-frontend.vercel.app/)

## 🌟 Features

✅ **User Management & Authentication**  
- Secure login & registration (username/password)  
- User roles: **Regular User & Admin**  
- Profile page with **credits, scan history, and requests**  

💳 **Credit System**  
- **20 free daily scans**, resets at midnight  
- **1 credit = 1 document scan**  
- Users can **request additional credits**  
- Admins can approve/deny requests  

📄 **Document Scanning & Matching**  
- Upload `.txt` files for scanning  
- **Matches documents** using text similarity algorithms (Levenshtein, Word Frequency)  
- **Bonus:** AI-powered matching using OpenAI/Gemini  

📊 **Smart Analytics Dashboard**  
- Track **user scans per day**  
- Identify **most common document topics**  
- View **top users by scans & credit usage**  
- Admins can **see credit statistics**  

---

## ⚙️ Tech Stack  

| Category      | Technology Used               |
|--------------|--------------------------------|
| **Frontend**  | HTML, CSS, JavaScript (Vanilla) |
| **Backend**   | Node.js, Express.js            |
| **Database**  | SQLite / JSON                   |
| **Storage**   | Local file system               |
| **Authentication** | Hashed Passwords (bcrypt)  |
| **Matching Algorithm** | Levenshtein Distance, Word Frequency |
| **Bonus AI** | Google Gemini API |

---

## 🔗 API Endpoints  

| Method | Endpoint             | Description |
|--------|----------------------|-------------|
| POST   | `/auth/register`     | Register new user |
| POST   | `/auth/login`        | User login (Session-based) |
| GET    | `/user/profile`      | Get user profile & credits |
| POST   | `/scan`              | Upload document for scanning (1 credit) |
| GET    | `/matches/:docId`    | Get matching documents |
| POST   | `/credits/request`   | Request admin to add credits |
| GET    | `/admin/analytics`   | Admin dashboard (View credit usage, top users) |

---

## 📥 Installation & Setup  

### 🚀 Backend Setup (Node.js + Express)  
```bash
git clone https://github.com/prakashvishal93/Document-Scanner-Matching-System.git
cd backend
npm install
npm start
