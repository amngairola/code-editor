import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // This function now simply validates and navigates.
  // The actual "joining" is handled by Socket.io on the EditorPage.
  const handleJoinRoom = () => {
    if (!roomId.trim() || !name.trim()) {
      toast.error("Room ID and Username are required!");
      return;
    }

    // Navigate to the editor page for the given room ID
    // Pass the username in the navigation state so EditorPage can use it
    navigate(`/editor/${roomId}`, {
      state: {
        name,
      },
    });
  };

  // Creates a new room ID and populates the input field
  const handleCreateNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("New Room ID has been created!");
  };

  // Allows joining by pressing the "Enter" key in the input fields
  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center">
      <div className="flex-grow flex items-center justify-center p-4 w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-700">
          <h1 className="text-4xl font-bold text-blue-400 text-center mb-2">
            Code Sync
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Real-time collaborative code editor
          </p>

          <div className="space-y-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
              placeholder="Enter Room ID"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyUp={handleInputEnter}
              placeholder="Enter Your Name"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <button
              onClick={handleJoinRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
            >
              Join Room
            </button>
            <div className="text-center text-gray-400">
              <p>
                If you don't have an invite, then create a{" "}
                <span
                  onClick={handleCreateNewRoom}
                  className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                >
                  new room
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
