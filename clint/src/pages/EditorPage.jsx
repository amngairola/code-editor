import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

// Import custom components
import Client from "../components/Client";
import Editor from "../components/Editor";
import OutputConsole from "../components/OutputConsole";

// Import CodeMirror language packages
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

// Import icons for the UI
import { VscEdit, VscDebugRestart, VscPlay, VscSync } from "react-icons/vsc";
import axios from "axios";

// default code snippet for languages
const defaultCodeSnippets = {
  javascript: 'console.log("Hello, World!");',
  python: 'def hello_world():\n    print("Hello, World!")',
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const EditorPage = () => {
  const socket = useSocket();
  const codeRef = useRef(null);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // State for UI and application logic
  const [clients, setClients] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCodeSnippets.javascript);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langExtension, setLangExtension] = useState(javascript({ jsx: true }));

  // This  useEffect handles all socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Get the current user's name from navigation state or generate a random one
    const currentUserName =
      location.state?.name || `Guest_${Math.floor(Math.random() * 100)}`;

    // Emit an event to the server to join the room
    socket.emit("join-room", { roomId, userName: currentUserName });

    // --- SET UP LISTENERS FOR SERVER EVENTS ---

    // 1. Listen for the 'joined' event (when any user joins)
    const handleJoined = ({ clients, userName, socketId }) => {
      // Show a toast notification only for *other* users joining
      if (userName !== currentUserName) {
        toast.success(`${userName} joined the room.`);
      }
      setClients(clients); // Update the list of collaborators
    };
    socket.on("joined", handleJoined);

    // 2. Listen for the 'disconnected' event
    const handleDisconnected = ({ socketId, userName }) => {
      toast.error(`${userName} left the room.`);
      // Remove the disconnected client from the state
      setClients((prev) =>
        prev.filter((client) => client.socketId !== socketId)
      );
    };
    socket.on("disconnected", handleDisconnected);

    // 3. Listen for code updates from other users
    const handleCodeUpdate = ({ code: serverCode }) => {
      // Update code only if it's different to prevent loops
      if (serverCode !== null && serverCode !== codeRef.current) {
        setCode(serverCode);
      }
    };
    socket.on("code-update", handleCodeUpdate);

    // 4. Listen for output console updates from other users
    const handleOutputUpdate = ({ output: serverOutput }) => {
      if (serverOutput !== null) {
        setOutput(serverOutput);
      }
    };
    socket.on("output-update", handleOutputUpdate);

    // --- CLEANUP ---
    // This function runs when the component unmounts to prevent memory leaks
    return () => {
      socket.off("joined", handleJoined);
      socket.off("disconnected", handleDisconnected);
      socket.off("code-update", handleCodeUpdate);
      socket.off("output-update", handleOutputUpdate);
    };
  }, [socket, roomId, location.state, navigate]);

  // Effect to keep codeRef updated with the latest code state
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Effect to update editor settings when the language dropdown changes
  useEffect(() => {
    const newCode = defaultCodeSnippets[language] || "";
    setCode(newCode); // Set the default code for the new language
    setOutput(""); // Clear the output console

    // Switch the CodeMirror language extension for syntax highlighting
    switch (language) {
      case "javascript":
        setLangExtension(javascript({ jsx: true }));
        break;
      case "python":
        setLangExtension(python());
        break;
      case "java":
        setLangExtension(java());
        break;

      default:
        setLangExtension(javascript({ jsx: true }));
    }
  }, [language]);

  // --- EVENT HANDLERS ---

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy Room ID.");
      console.error(err);
    }
  };

  const handleLeaveRoom = () => {
    toast.info("You have left the room.");
    navigate("/");
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket) {
      // Emit the code change to the server
      socket.emit("code-change", { roomId, code: newCode });
    }
  };

  const handleClearOutput = () => {
    const clearedOutput = "";
    setOutput(clearedOutput);
    // Also broadcast that the output was cleared
    if (socket) {
      socket.emit("output-change", { roomId, output: clearedOutput });
    }
  };

  const handleReset = () => {
    const defaultCode = defaultCodeSnippets[language];
    setCode(defaultCode);
    // Broadcast the reset code to other users
    if (socket) {
      socket.emit("code-change", { roomId, code: defaultCode });
    }
    toast.info(`Code reset to default for ${language}.`);
  };

  // handle run method
  axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const handleRun = async () => {
    setLoading(true);

    const initialOutput = `Executing... `;
    setOutput(initialOutput);

    // Broadcast the "Executing..." message to all users

    if (socket) {
      socket.emit("output-change", { roomId, output: initialOutput });
    }

    try {
      // The API call

      const { data } = await axios.post(`/api/run`, {
        language,
        code,
      });

      const finalOutput = data.output || "No output from AI.";
      setOutput(finalOutput);

      // Broadcast the final result to all users
      if (socket) {
        socket.emit("output-change", { roomId, output: finalOutput });
      }
    } catch (error) {
      console.error("Error executing code:", error);

      const errorMsg =
        error.response?.data?.error || // Check for backend-sent error
        error.message || // Fallback to generic network error
        "An unexpected error occurred.";

      setOutput(errorMsg); // Update local state with the error

      // Broadcast the specific error message to all users
      if (socket) {
        socket.emit("output-change", { roomId, output: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <div className="flex-grow flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-800 p-4 flex flex-col justify-between border-r border-gray-700">
          <div>
            <h4 className="text-xl font-bold mb-4 text-gray-100">Room ID:</h4>
            <div className="bg-gray-700 text-gray-300 p-2 rounded-md text-center text-lg font-mono break-all mb-4">
              {roomId}
            </div>
            <h4 className="text-xl font-bold mb-4 text-gray-100 mt-6">
              Collaborators
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {clients.map((client) => (
                <Client
                  key={client.socketId}
                  socketId={client.socketId}
                  userName={client.userName}
                />
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <label
              htmlFor="language-select"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Language:
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-white text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <div className="mt-8">
              <button
                onClick={copyId}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mb-3"
              >
                Copy Room ID
              </button>
              <button
                onClick={handleLeaveRoom}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
              >
                Leave Room
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Editor Area */}
        <div className="flex-grow bg-gray-900 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
              <VscEdit className="text-purple-400 text-xl" />
              Code Editor (<span className="text-blue-400">{language}</span>)
            </h2>
            <div className="flex gap-3 items-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium rounded-md transition-colors duration-200 flex items-center gap-1"
                title={`Reset ${language} code to default`}
              >
                <VscDebugRestart className="text-lg" />
                Reset
              </button>
              <button
                onClick={handleRun}
                disabled={loading}
                className={`px-6 py-2 rounded-md transition-colors duration-200 flex items-center gap-2 ${
                  loading
                    ? "bg-blue-800 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-bold shadow-md`}
                title={loading ? "Executing code..." : `Run ${language} code`}
              >
                {loading ? (
                  <>
                    <VscSync className="animate-spin text-xl" />
                    Running...
                  </>
                ) : (
                  <>
                    <VscPlay className="text-xl" />
                    Run Code
                  </>
                )}
              </button>
            </div>
          </div>
          <Editor
            value={code}
            height="calc(100vh - 300px)"
            theme="dark"
            extensions={[langExtension]}
            onChange={handleCodeChange}
          />
          <OutputConsole output={output} onClear={handleClearOutput} />
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
