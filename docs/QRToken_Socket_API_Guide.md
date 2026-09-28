# 🔌 QRToken — Complete Socket.IO & REST API Reference
### For Backend & Frontend Developers

---

## 🌐 Base URLs

| Environment | URL |
|---|---|
| **REST API Base URL** | `https://qrcode-ac0d.onrender.com/api` |
| **Socket.IO Server URL** | `https://qrcode-ac0d.onrender.com` |
| **Frontend Web App** | `https://qrcode-bytsol.vercel.app` |
| **Socket.IO Version** | `v4.x` |

---

## 📁 Source Files Reference

| File | Purpose |
|---|---|
| `server/server.js` | Socket.IO server setup + room join handlers |
| `server/controllers/orderController.js` | All socket emit calls (server → client) |
| `client/src/pages/customer/TrackPage.jsx` | Customer socket listener |
| `client/src/pages/admin/AdminDashboard.jsx` | SuperAdmin socket listener |

---

## 🚪 STEP 1 — Client Connects to Socket Server

### Install Socket.IO Client
```bash
npm install socket.io-client
```

### Connect to Server
```javascript
import { io } from 'socket.io-client';

const socket = io('https://qrcode-ac0d.onrender.com', {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

socket.on('connect', () => {
  console.log('✅ Connected! Socket ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.warn('⚠️ Disconnected:', reason);
});
```

---

## 🚪 STEP 2 — Room Join Events (Client → Server)

Client ko ek specific **room** join karna hota hai taaki targeted events receive ho sakein.

### `join-merchant` — Owner / Kitchen / Staff Room Join

| Field | Value |
|---|---|
| **Direction** | Client → Server |
| **Who Uses** | Owner Panel, Kitchen KDS, Staff Screen |
| **When to Emit** | Jab Owner Dashboard ya Kitchen Queue load ho |

```javascript
// Owner / Kitchen Panel use karta hai
const merchantId = "65f0123456789abcdef01234"; // MongoDB merchantId
socket.emit('join-merchant', merchantId);
```

---

### `join-order` — Customer Live Tracking Room Join

| Field | Value |
|---|---|
| **Direction** | Client → Server |
| **Who Uses** | Customer Track Page |
| **When to Emit** | Order place hone ke baad Track Page open ho |

```javascript
// Customer TrackPage.jsx use karta hai
const orderId = "66d01a2b3c4d5e6f7a8b9c0d"; // MongoDB _id of order
socket.emit('join-order', orderId);
```

---

### `join-admin` — Super Admin Room Join

| Field | Value |
|---|---|
| **Direction** | Client → Server |
| **Who Uses** | SuperAdmin Dashboard |
| **When to Emit** | Admin panel load ho |

```javascript
// AdminDashboard.jsx use karta hai
socket.emit('join-admin');
```

---

## 📡 STEP 3 — Broadcast Events (Server → Client)

Yeh events **server** automatically broadcast karta hai jab koi specific action hota hai. Client ko sirf **listen** karna hai.

---

### 🔔 Event: `new-order`

| Field | Value |
|---|---|
| **Direction** | Server → Client |
| **Emitted To Room** | `merchant-${merchantId}` |
| **Triggered By** | `POST /api/orders` — Naya order place hona |
| **Who Should Listen** | Owner Panel, Kitchen KDS |
| **File (Server)** | `orderController.js` Line 109 |

```javascript
socket.on('new-order', (order) => {
  console.log('🔔 New Order Received:', order.tokenNumber);
  /*
    order = {
      _id: "66d01a2b...",
      tokenNumber: "A-015",
      merchantId: "65f01234...",
      tableId: "3",
      customerName: "Rahul",
      customerPhone: "9876543210",
      payMode: "cash",
      paymentStatus: "pending",
      status: "placed",
      total: 240,
      subtotal: 250,
      discountAmount: 10,
      items: [
        { name: "Masala Tea", quantity: 4, price: 10 },
        { name: "Vada Pav", quantity: 10, price: 20 }
      ],
      createdAt: "2026-09-08T11:20:00.000Z"
    }
  */
  // Action: Append to live orders list, play notification sound
});
```

---

### 🔄 Event: `order-updated`

| Field | Value |
|---|---|
| **Direction** | Server → Client |
| **Emitted To Room** | `merchant-${merchantId}` |
| **Triggered By** | `PUT /api/orders/:id/status` — Order status change |
| **Who Should Listen** | Owner Panel, Kitchen KDS, Staff Screen |
| **File (Server)** | `orderController.js` Line 251 |

```javascript
socket.on('order-updated', (order) => {
  console.log('⚡ Order Updated:', order.tokenNumber, '→', order.status);
  /*
    order = full updated order object (same shape as new-order above)
    status: "placed" | "preparing" | "ready" | "collected" | "cancelled"
    paymentStatus: "pending" | "paid" | "refunded"
  */
  // Action: Update order card in list by _id
});
```

---

### 📱 Event: `order-status-update`

| Field | Value |
|---|---|
| **Direction** | Server → Client |
| **Emitted To Room** | `order-${orderId}` |
| **Triggered By** | `PUT /api/orders/:id/status` — Kitchen/Owner changes status |
| **Who Should Listen** | Customer Track Page ONLY |
| **File (Server)** | `orderController.js` Line 250 |
| **File (Client)** | `TrackPage.jsx` Line 71 |

```javascript
socket.on('order-status-update', ({ orderId, status, paymentStatus }) => {
  console.log(`📦 Order ${orderId} → Status: ${status}`);
  /*
    Payload:
    {
      orderId: "66d01a2b3c4d5e6f7a8b9c0d",
      status: "ready",         // "placed"|"preparing"|"ready"|"collected"|"cancelled"
      paymentStatus: "pending" // "pending" | "paid" | "refunded"
    }
  */
  // status === 'ready'     → Show "Your food is ready! 🎉"
  // status === 'collected' → Show "Thank you! Order completed ✅"
});
```

---

### 🌍 Event: `platform-order-updated`

| Field | Value |
|---|---|
| **Direction** | Server → Client |
| **Emitted To Room** | `admin` |
| **Triggered By** | New order placed OR any order status updated |
| **Who Should Listen** | SuperAdmin Dashboard ONLY |
| **File (Server)** | `orderController.js` Lines 108, 179, 252 |
| **File (Client)** | `AdminDashboard.jsx` Line 70 |

```javascript
socket.on('platform-order-updated', (order) => {
  console.log('🌍 Platform Order Update:', order.tokenNumber, '@', order.merchantId);
  /*
    order = full order object
    SuperAdmin ko SAARE restaurants ke live orders dikhte hain
  */
  // Action: Refresh platform stats / live order feed
});
```

---

### ⚠️ Event: `item-sold-out`

| Field | Value |
|---|---|
| **Direction** | Server → Client |
| **Emitted To Room** | `merchant-${merchantId}` |
| **Triggered By** | Menu item stock 0 ho jata hai after any order |
| **Who Should Listen** | Owner Panel, Kitchen KDS |
| **File (Server)** | `orderController.js` Lines 80, 168 |

```javascript
socket.on('item-sold-out', ({ itemId, name }) => {
  console.log(`⚠️ SOLD OUT: ${name} (ID: ${itemId})`);
  /*
    Payload:
    {
      itemId: "65f0abc123...",  // MongoDB MenuItem _id
      name: "Cutting Chai"      // Item display name
    }
  */
  // Action: Mark item unavailable in menu UI
  // Show toast: "Cutting Chai is now SOLD OUT!"
});
```

---

## 📊 All Socket Events — Summary Table

| # | Event Name | Direction | Room | Triggered By | Used By |
|---|---|---|---|---|---|
| 1 | `join-merchant` | Client → Server | `merchant-{id}` | Owner/Kitchen opens panel | Owner, KDS |
| 2 | `join-order` | Client → Server | `order-{id}` | Customer opens Track page | Customer |
| 3 | `join-admin` | Client → Server | `admin` | Admin opens dashboard | SuperAdmin |
| 4 | `new-order` | Server → Client | `merchant-{id}` | `POST /api/orders` — New order | Owner, Kitchen |
| 5 | `order-updated` | Server → Client | `merchant-{id}` | `PUT /api/orders/:id/status` | Owner, Kitchen |
| 6 | `order-status-update` | Server → Client | `order-{id}` | `PUT /api/orders/:id/status` | Customer only |
| 7 | `platform-order-updated` | Server → Client | `admin` | New order OR status change | SuperAdmin |
| 8 | `item-sold-out` | Server → Client | `merchant-{id}` | Stock hits 0 | Owner, Kitchen |

---

## 🔌 Full Kitchen/Owner Implementation Example

```javascript
import { io } from 'socket.io-client';
import { useEffect } from 'react';

export default function KitchenScreen({ merchantId }) {
  useEffect(() => {
    const socket = io('https://qrcode-ac0d.onrender.com');

    // STEP 1: Join merchant room
    socket.emit('join-merchant', merchantId);

    // STEP 2: New order arrives
    socket.on('new-order', (order) => {
      console.log('🔔 New Order:', order.tokenNumber);
      // play bell sound, add to kitchen queue
    });

    // STEP 3: Order status changed
    socket.on('order-updated', (order) => {
      console.log('⚡ Updated:', order.tokenNumber, order.status);
      // update order card in state
    });

    // STEP 4: Item sold out alert
    socket.on('item-sold-out', ({ name }) => {
      console.warn(`⚠️ ${name} SOLD OUT!`);
      // show toast, mark item unavailable
    });

    // Cleanup when component unmounts
    return () => socket.disconnect();
  }, [merchantId]);
}
```

---

## 🔐 REST API Auth Header

Owner-protected endpoints ke liye JWT token required hai:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

> JWT Token milta hai `POST /api/auth/login` ke response mein `token` field se.

---

## 🔗 Complete REST API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ Public | Login (Owner / Admin) |
| `POST` | `/api/auth/register` | ❌ Public | Register new owner |
| `GET` | `/api/merchant/me` | ✅ Owner | Get my merchant profile + QR |
| `PUT` | `/api/merchant/me` | ✅ Owner | Update merchant profile |
| `POST` | `/api/merchant/generate-qr` | ✅ Owner | Generate table/outlet QR code |
| `GET` | `/api/menu/:merchantId` | ❌ Public | Get restaurant full menu |
| `POST` | `/api/menu` | ✅ Owner | Add new menu item |
| `PUT` | `/api/menu/:id` | ✅ Owner | Update existing menu item |
| `DELETE` | `/api/menu/:id` | ✅ Owner | Delete menu item |
| `POST` | `/api/orders` | ❌ Public | Place new customer order |
| `POST` | `/api/orders/verify-payment` | ❌ Public | Verify Razorpay payment |
| `GET` | `/api/orders/:id` | ❌ Public | Get single order by ID |
| `GET` | `/api/orders/:id/invoice` | ❌ Public | Get GST tax invoice JSON |
| `POST` | `/api/orders/:id/feedback` | ❌ Public | Submit customer rating/review |
| `POST` | `/api/orders/validate-coupon` | ❌ Public | Validate & apply coupon |
| `GET` | `/api/orders/merchant/:merchantId` | ✅ Owner | Get all merchant orders (with date/status filter) |
| `GET` | `/api/orders/tables/:merchantId` | ❌ Public | Get active occupied table sessions |
| `PUT` | `/api/orders/:id/status` | ✅ Owner | Update order status |
| `POST` | `/api/orders/:id/refund` | ✅ Owner | Refund order via Razorpay |
| `GET` | `/api/analytics/overview/:merchantId` | ✅ Owner | Dashboard analytics & revenue |
| `POST` | `/api/coupons` | ✅ Owner | Create new coupon |
| `GET` | `/api/coupons/:merchantId` | ✅ Owner | List all merchant coupons |
| `PUT` | `/api/coupons/:id` | ✅ Owner | Update coupon details |
| `DELETE` | `/api/coupons/:id` | ✅ Owner | Delete coupon |
| `POST` | `/api/upload/image` | ✅ Owner | Upload menu item image (Cloudinary) |
| `GET` | `/api/admin/merchants` | ✅ SuperAdmin | List all platform merchants |
| `GET` | `/api/admin/stats` | ✅ SuperAdmin | Platform-wide GMV & stats |
| `GET` | `/health` | ❌ Public | Server health check |
