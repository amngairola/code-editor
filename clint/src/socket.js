import { io } from "socket.io-client";
import dotenv from "dotenv";

const BACKEND_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_URL || "http://localhost:3000";

console.log(`Connecting to backend at: ${BACKEND_URL}`);

const socket = io(BACKEND_URL, {
  autoConnect: false,

  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
});

// Export the socket instance as the default export for this module
export default socket;
