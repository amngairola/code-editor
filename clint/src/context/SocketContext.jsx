import { createContext, useContext, useEffect } from "react";
import socket from "../socket";

// 1. Create the React Context
const SocketContext = createContext(socket);

// 2. Create a custom hook for easy access to the socket instance from any component
export const useSocket = () => {
  return useContext(SocketContext);
};

// 3. Create the Provider component that will wrap our application
export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Manually connect the socket when the provider mounts
    socket.connect();
    console.log("Socket.io connection initiated via context.");

    socket.on("connect", () => {
      console.log("Socket connected successfully with ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    // Cleanup function to disconnect the socket when the app unmounts
    return () => {
      if (socket.connected) {
        console.log("Disconnecting socket from context cleanup.");
        socket.disconnect();
      }
    };
  }, []); // The empty dependency array ensures this runs only once

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
