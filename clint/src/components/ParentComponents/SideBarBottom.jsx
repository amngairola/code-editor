import React from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const SideBarBottom = ({ language, setLanguage }) => {
  const { roomId } = useParams();

  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    toast.info("You have left the room.");
    navigate("/");
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("copied ");
    } catch (err) {
      toast.error("Failed to copy ");
      console.error(err);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Language Selection Layout block */}
      <div className="space-y-2">
        <label
          htmlFor="language-select"
          className="block text-xs font-semibold uppercase tracking-wider text-zinc-500"
        >
          Language
        </label>
        <div className="relative group">
          <select
            id="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none block w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all cursor-pointer pr-10"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
          {/* Custom Chevron drop icon layout */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-zinc-400 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Platform Utility Room Action Row Options */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={copyId}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm shadow-lg shadow-indigo-600/10 transition-all active:scale-[0.98]"
        >
          Copy Room ID
        </button>
        <button
          onClick={handleLeaveRoom}
          className="w-full bg-zinc-900/50 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 font-semibold py-2.5 px-4 rounded-xl text-sm border border-zinc-800 hover:border-red-500/20 transition-all active:scale-[0.98]"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};

export default SideBarBottom;
