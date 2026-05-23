import React, { useState } from "react";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  Code2,
  Users2,
  Zap,
  ArrowRight,
  Terminal,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col font-sans antialiased selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Split Screen Container */}
      <div className="flex-grow flex h-full w-full">
        {/* LEFT SIDE: Authentic Authentication Form Interface */}
        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-between p-6 sm:p-10 relative z-10 bg-[#09090b]">
          {/* Top Brand Block */}
          <div className="flex items-center gap-3 pt-4">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
              <span className="text-white text-xl font-bold italic">C</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-100">
              Collabb
            </span>
          </div>

          {/* Form Content Hub */}
          <div className="my-auto py-12 max-w-[400px] w-full mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-100">
                Welcome Back
              </h1>
              <p className="text-zinc-400 text-sm">
                Enter your workspace details to start collaborating with your
                team in real time.
              </p>
            </div>

            {/* Central Entry Card Structure */}
            <div className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 ml-1">
                    Room ID
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      onKeyUp={handleInputEnter}
                      placeholder="Paste or type invitation ID"
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400 ml-1">
                    Your Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyUp={handleInputEnter}
                      placeholder="e.g. Aman Gairola"
                      className="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-800 focus:border-indigo-500 rounded-xl text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
                    />
                  </div>
                </div>

                <button
                  onClick={handleJoinRoom}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] mt-2 flex items-center justify-center gap-2 group"
                >
                  <span>Join Workspace</span>
                  <ArrowRight
                    size={16}
                    className="text-indigo-200 group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
              </div>

              {/* Action Callout Section */}
              <div className="pt-5 border-t border-zinc-900 text-center">
                <p className="text-xs text-zinc-500 font-medium">
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

          {/* Minimal Bottom Note */}
          <div className="text-[11px] text-zinc-600 font-mono pt-4">
            v2.4.0 // production_ready
          </div>
        </div>

        {/* RIGHT SIDE: Futuristic Developer Visual Canvas Showcase */}
        <div className="hidden lg:flex lg:flex-1 bg-[#0b0b0e] border-l border-zinc-900 relative items-center justify-center p-12 overflow-hidden">
          {/* Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

          {/* Large Ambient Glow Blurs */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 left-12 w-96 h-96 rounded-full bg-indigo-600/20 blur-[100px] pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-12 right-12 w-96 h-96 rounded-full bg-purple-600/15 blur-[120px] pointer-events-none"
          />

          {/* Core Graphic Content Cluster */}
          <div className="relative w-full max-w-xl flex flex-col items-center">
            {/* Animated Floating Monaco Style Editor Showcase */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-md overflow-hidden relative group"
            >
              {/* Terminal Window Header */}
              <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <span className="text-[11px] font-mono text-zinc-500 ml-2 flex items-center gap-1">
                    <Terminal size={12} /> workspace_session.js
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                    3 active peers
                  </span>
                </div>
              </div>

              {/* Mock Code Blocks */}
              <div className="p-6 font-mono text-xs leading-relaxed text-zinc-400 space-y-1.5 bg-[#0c0c0e]/60">
                <p>
                  <span className="text-purple-400">import</span>{" "}
                  {"{ createServer }"}{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-400">"collabb-sync"</span>;
                </p>
                <p>
                  <span className="text-purple-400">const</span> workspace ={" "}
                  <span className="text-blue-400">createServer</span>(
                  {"{ roomId: "}
                  <span className="text-emerald-400">"room-abc-123"</span>
                  {" }"});
                </p>
                <p className="pl-4 text-zinc-600">
                  // Synchronizing operational transforms safely...
                </p>
                <p className="pl-4 text-zinc-300">
                  workspace.<span className="text-yellow-400">on</span>(
                  <span className="text-emerald-400">"codeUpdate"</span>,
                  (delta) =&gt; {"{"}
                </p>
                <p className="pl-8 text-zinc-300">
                  applyTransforms(delta.currentCode);
                </p>
                <p className="pl-4 text-zinc-300">{"});"}</p>
              </div>

              {/* Overlay Glassmorphic Floating Assistant Card */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-6 -right-6 bg-zinc-900/90 border border-zinc-700/50 p-4 rounded-xl shadow-xl shadow-black/60 backdrop-blur-md max-w-xs flex gap-3 items-start"
              >
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-200">
                    AI Copilot Analysis
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Real-time operational streams configured perfectly.
                    Synchronization latency optimized to under 12ms.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Bottom Strategic Value Indicators Grid */}
            <div className="grid grid-cols-3 gap-4 w-full mt-14 relative z-10">
              <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
                <Code2 size={16} className="text-indigo-400" />
                <h5 className="text-xs font-semibold text-zinc-300">
                  Monaco Backbone
                </h5>
                <p className="text-[10px] text-zinc-500">
                  Rich syntax assistance and auto completions natively.
                </p>
              </div>
              <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
                <Users2 size={16} className="text-purple-400" />
                <h5 className="text-xs font-semibold text-zinc-300">
                  Socket Matrix
                </h5>
                <p className="text-[10px] text-zinc-500">
                  Concurrent user cursors tracking cursor events dynamically.
                </p>
              </div>
              <div className="p-4 bg-zinc-950/40 border border-zinc-900 rounded-xl space-y-1">
                <Zap size={16} className="text-amber-400" />
                <h5 className="text-xs font-semibold text-zinc-300">
                  AI Side Panel
                </h5>
                <p className="text-[10px] text-zinc-500">
                  Instant background diagnostic and algorithmic refinement
                  metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Global System Layout Footer */}
      <div className="w-full z-10 shrink-0">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
