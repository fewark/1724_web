import { io } from "socket.io-client";

// Connect to the backend Socket.IO server.
// If using proxy configuration in vite.config.js, you may use a relative URL.
const socket = io("http://localhost:3000");

export default socket;