# 💬 PingMe Chat

**A real-time fullstack chat application built with React, Node.js, MongoDB, and Socket.IO.**

## 🚀 Features

### 🌟 Core Functionalities

- **Real-time Messaging:** Direct and group chat
- **Message Management:** Edit and delete messages with real-time socket synchronization.
- **Rich Media Support:** Send text, multi-images, and file attachments (preview & download).
- **Theming:** Toggle between Dark and Light mode.
- **Advanced Chat Features:**
  - Infinite scroll message history.
  - Seen status and unread message count.
  - Real-time online/offline user status.

### 🔐 User Authentication

- JWT authentication (access + refresh token)
- Secure session with HTTP-only cookies
- Password recovery via OTP (email-based verification)

### 👥 Social Features

- Send / cancel / accept / decline friend requests
- Manage friend list

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Zustand
- **Backend**: Node.js + Express.js + Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT + HTTP-only Cookies
- **Email Service**: Nodemailer (OTP Verification)
- **Media Storage**: Cloudinary

## 🌐 Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/ThanhDai2005/pingme-chat.git
cd pingme-chat
```

#### 2. Configure Environment Variables

Create `.env` in backend:

```env
PORT=3000
MONGO_URL=your_mongodb_connection
ACCESS_TOKEN_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173

CLOUD_NAME=your_cloudinary_name
CLOUD_KEY=your_cloudinary_key
CLOUD_SECRET=your_cloudinary_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Create `.env` in frontend:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

#### 3. Setup Backend

```bash
cd backend
npm install
npm run dev
```

#### 4. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📸 Screenshots

### 1. Sign In

![Sign In](./frontend/public/signin-chat.png)

### 2. Chat UI

![Chat](./frontend/public/pingme-chat.png)

## 🤝 Contributing

Contributions are welcome! Feel free to fork and submit a pull request.

## 💌 Contact

- **Developer:** [ThanhDai2005](mailto:Dai2272005nv@gmail.com)
- **GitHub:** [GitHub Profile](https://github.com/ThanhDai2005)
