import { io } from "socket.io-client";

const socket = io("https://qrcode-ac0d.onrender.com", {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ QRToken Socket Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ QRToken Socket Disconnected:", reason);
});

export default socket;