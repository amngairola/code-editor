import express from "express";
import cors from "cors";
import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(cors());
app.use(express.json());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// In-memory storage for the application state
const userSocketMap = {}; // Maps: socketId -> userName
const roomCodeMap = {}; // Maps: roomId -> currentCode

// Helper function to get all clients in a room
function getAllConnectedClients(roomId) {
  // io.sockets.adapter.rooms.get(roomId) returns a Set of socketIds
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => ({
      socketId,
      userName: userSocketMap[socketId],
    })
  );
}

// Main Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`[CONNECT] User connected: ${socket.id}`);

  // Event handler for a user joining a room
  socket.on("join-room", ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // Notify everyone in the room (including the sender) about the new client list
    io.to(roomId).emit("joined", {
      clients,
      userName,
      socketId: socket.id,
    });

    // Send the room's current code only to the new user
    if (roomCodeMap[roomId]) {
      io.to(socket.id).emit("code-update", { code: roomCodeMap[roomId] });
    }
  });

  // Event handler for code changes
  socket.on("code-change", ({ roomId, code }) => {
    roomCodeMap[roomId] = code; // Update the code for the room
    // Broadcast code changes to everyone except the sender
    socket.to(roomId).emit("code-update", { code });
  });

  // Event handler for synchronizing the output console
  socket.on("output-change", ({ roomId, output }) => {
    // Broadcast the new output to everyone else in the room
    socket.to(roomId).emit("output-update", { output });
  });

  // Event handler for when a user is disconnecting
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      // We don't want to broadcast to the socket's own private room
      if (roomId !== socket.id) {
        const disconnectedUserName = userSocketMap[socket.id];
        if (disconnectedUserName) {
          // Notify everyone else that this user has left
          socket.to(roomId).emit("disconnected", {
            socketId: socket.id,
            userName: disconnectedUserName,
          });
        }
      }
    });
    // Clean up the user from our map
    delete userSocketMap[socket.id];
  });

  socket.on("disconnect", () => {
    console.log(`[DISCONNECT] User disconnected fully: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running and listening on http://localhost:${PORT}`);
});
