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
    <div className="relative min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 overflow-hidden selection:bg-indigo-500/30 font-sans antialiased">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />

      <div className="flex-grow flex items-center justify-center p-4 w-full z-10">
        <div className="w-full max-w-[420px]">
          {/* Brand Core Logo Area */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-4">
              <span className="text-white text-2xl font-bold italic">C</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              Collabb
            </h1>
            <p className="text-zinc-500 text-sm mt-1 text-center">
              Real-time collaborative code editor workspace
            </p>
          </div>

          {/* Central Entry Card Structure */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/50 space-y-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onKeyUp={handleInputEnter}
                  placeholder="Paste or type invitation ID"
                  className="w-full px-4 py-2.5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 ml-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyUp={handleInputEnter}
                  placeholder="e.g. Aman Gairola"
                  className="w-full px-4 py-2.5 bg-zinc-800/40 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                />
              </div>

              <button
                onClick={handleJoinRoom}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] mt-2"
              >
                Join Workspace
              </button>
            </div>

            {/* Action Callout Section */}
            <div className="pt-4 border-t border-zinc-800/60 text-center">
              <p className="text-sm text-zinc-500 font-medium">
                Missing an invitation code?{" "}
                <span
                  onClick={handleCreateNewRoom}
                  className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline transition-colors"
                >
                  create a new room
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Global System Layout Footer */}
      <div className="w-full z-10">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
