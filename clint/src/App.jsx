// src/App.jsx
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Make sure path and component name match
import EditorPage from "./pages/EditorPage"; // Make sure path and component name match
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Home from "./pages/Home";
import { SocketProvider } from "./context/SocketContext";

const App = () => {
  return (
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Home />} />{" "}
          <Route path="/editor/:roomId" element={<EditorPage />} />{" "}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          theme="colored"
        />
      </SocketProvider>
    </BrowserRouter>
  );
};

export default App;
