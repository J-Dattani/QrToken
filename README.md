# QRToken - Unified Web Application

A single, unified React + Vite frontend application for QRToken, combining **Customer Ordering**, **Restaurant Owner Console**, and **Admin Portal**.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will start on `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Routes & Modules

| Module | URL Path | Description |
| :--- | :--- | :--- |
| **Customer App** | `/` or `/shop/:merchantId` | Menu, cart, checkout, token tracking |
| **Owner Login** | `/login` (or `/owner/login`) | Restaurant Owner sign-in |
| **Owner Register** | `/register` | Restaurant registration |
| **Owner Console** | `/owner` | Live Orders, Kitchen Queue, Tables, History, Finance |
| **Admin Portal** | `/admin` | System Admin Portal |

---

## 📁 Project Structure

```
QrToken-main/
├── public/                 # Favicon, icons, PWA assets
├── src/
│   ├── customer/          # Customer ordering pages & components
│   ├── owner/             # Restaurant owner console & pages
│   ├── admin/             # Admin portal
│   ├── redux/             # Unified Redux store
│   ├── routes/            # Unified routing (AppRoutes.jsx)
│   ├── theme/             # Unified MUI theme
│   ├── App.jsx            # Main app shell
│   ├── index.css          # Tailwind CSS & global styles
│   └── main.jsx           # App entry point
├── .env                   # Environment variables
├── index.html             # Single entry HTML
├── package.json           # Single package.json & dependencies
└── vite.config.js         # Single Vite configuration
```
