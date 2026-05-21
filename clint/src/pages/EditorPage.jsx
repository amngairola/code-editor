<<<<<<< HEAD
import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  lazy,
  useMemo,
} from "react";
=======
import React, { useEffect, useState, useRef } from "react";
>>>>>>> origin/main
import { toast } from "react-toastify";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

// Import custom components
import Client from "../components/Client";
<<<<<<< HEAD

import OutputConsole from "../components/OutputConsole";

// // Import CodeMirror language packages
=======
import Editor from "../components/Editor";
import OutputConsole from "../components/OutputConsole";

// Import CodeMirror language packages
>>>>>>> origin/main
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

// Import icons for the UI
import { VscEdit, VscDebugRestart, VscPlay, VscSync } from "react-icons/vsc";
import axios from "axios";
<<<<<<< HEAD
const LeftSIdeBar = lazy(() =>
  import("../components/ParentComponents/LeftSIdeBar")
);

import LeftSideBarSkeleton from "../components/LeftSideBarSkeleton";

const CodeEditor = lazy(() => import("../components/CodeEditor"));
import CodeEditorSkeleton from "../components/CodeEditorSkeleto";
import { useDraggableSidebar } from "../useDraggableSidebar";
=======
>>>>>>> origin/main

// default code snippet for languages
const defaultCodeSnippets = {
  javascript: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const EditorPage = () => {
  const socket = useSocket();
<<<<<<< HEAD
  const codeRef = useRef(defaultCodeSnippets.javascript);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editorInstanceRef = useRef(null);
=======
  const codeRef = useRef(null);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
>>>>>>> origin/main

  // State for UI and application logic
  const [clients, setClients] = useState([]);
  const [language, setLanguage] = useState("javascript");
<<<<<<< HEAD
  // const [code, setCode] = useState(defaultCodeSnippets.javascript);
=======
  const [code, setCode] = useState(defaultCodeSnippets.javascript);
>>>>>>> origin/main
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langExtension, setLangExtension] = useState(javascript({ jsx: true }));

<<<<<<< HEAD
  const isRemoteUpdate = useRef(false);

  const { width, onMouseDown } = useDraggableSidebar({ min: 150, max: 500 });

=======
>>>>>>> origin/main
  // This  useEffect handles all socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Get the current user's name from navigation state or generate a random one
    const currentUserName =
      location.state?.name || `Guest_${Math.floor(Math.random() * 100)}`;

<<<<<<< HEAD
    console.log("editor username: ", currentUserName);
=======
>>>>>>> origin/main
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
<<<<<<< HEAD
        codeRef.current = serverCode;

        if (editorInstanceRef.current) {
          const pos = editorInstanceRef.current.getPosition();
          editorInstanceRef.current.setValue(serverCode);
          editorInstanceRef.current.setPosition(pos);
        }
=======
        setCode(serverCode);
>>>>>>> origin/main
      }
    };
    socket.on("code-update", handleCodeUpdate);

    // 4. Listen for output console updates from other users
    const handleOutputUpdate = ({ output: serverOutput }) => {
<<<<<<< HEAD
      isRemoteUpdate.current = true;
      if (serverOutput !== null) {
        setOutput(serverOutput);
      }
      isRemoteUpdate.current = false;
=======
      if (serverOutput !== null) {
        setOutput(serverOutput);
      }
>>>>>>> origin/main
    };
    socket.on("output-update", handleOutputUpdate);

    // --- CLEANUP ---
<<<<<<< HEAD

=======
    // This function runs when the component unmounts to prevent memory leaks
>>>>>>> origin/main
    return () => {
      socket.off("joined", handleJoined);
      socket.off("disconnected", handleDisconnected);
      socket.off("code-update", handleCodeUpdate);
      socket.off("output-update", handleOutputUpdate);
    };
  }, [socket, roomId, location.state, navigate]);

<<<<<<< HEAD
  // Effect to update editor settings when the language dropdown changes
  useEffect(() => {
    const newCode = defaultCodeSnippets[language] || "";
    codeRef.current = newCode; // Set the default code for the new language
    setOutput("");

    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(newCode);
    }
=======
  // Effect to keep codeRef updated with the latest code state
  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  // Effect to update editor settings when the language dropdown changes
  useEffect(() => {
    const newCode = defaultCodeSnippets[language] || "";
    setCode(newCode); // Set the default code for the new language
    setOutput(""); // Clear the output console
>>>>>>> origin/main

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

<<<<<<< HEAD
  const handleCodeChange = (newCode) => {
    codeRef.current = newCode;
    if (!isRemoteUpdate.current && socket) {
=======
  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("copied ");
    } catch (err) {
      toast.error("Failed to copy ");
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
>>>>>>> origin/main
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
<<<<<<< HEAD
    codeRef.current = defaultCode;

    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(defaultCode);
    }

=======
    setCode(defaultCode);
>>>>>>> origin/main
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

<<<<<<< HEAD
    const code = codeRef.current;
=======
>>>>>>> origin/main
    try {
      // The API call

      const { data } = await axios.post(`/api/run`, {
        language,
        code,
      });

      const finalOutput = data.output || "No output";
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
<<<<<<< HEAD
  const memoizedClients = useMemo(() => clients, [clients]);
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col font-sans antialiased selection:bg-indigo-500/30">
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar Layout Frame */}
        <Suspense fallback={<LeftSideBarSkeleton />}>
          <aside style={{ width, flexShrink: 0, overflow: "hidden" }}>
            <LeftSIdeBar
              width={width}
              clients={memoizedClients}
              language={language}
              setLanguage={setLanguage}
            />
          </aside>
        </Suspense>

        {/* the drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="relative group flex items-center justify-center transition-all duration-200 hover:w-[8px]"
          style={{
            width: "4px",
            cursor: "col-resize",
            zIndex: 40,
          }}
        >
          {/* The Core Structural Line */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-800 group-hover:bg-indigo-500/40 group-active:bg-indigo-500 h-full transition-all duration-150 pointer-events-none" />

          {/* Active Glowing Layer */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-indigo-500/0 group-hover:bg-indigo-500/10 group-active:bg-indigo-500/20 h-full blur-[2px] transition-all duration-150 pointer-events-none" />

          {/* Tactile White Gripper Dots (Centered vertically) */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex flex-col justify-center gap-1.5 opacity-40 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-150 pointer-events-none">
            <div className="w-[3px] h-[3px] bg-white rounded-full shadow-sm shadow-black" />
            <div className="w-[3px] h-[3px] bg-white rounded-full shadow-sm shadow-black" />
            <div className="w-[3px] h-[3px] bg-white rounded-full shadow-sm shadow-black" />
          </div>

          {/* Expanded Invisible Click Target Area */}
          <div className="absolute top-0 bottom-0 -left-2 -right-2 h-full pointer-events-none" />
        </div>

        {/* Right Side: Editor Workspace Canvas Area */}
        <div className="flex-grow bg-[#09090b] p-6 flex flex-col min-w-0 overflow-y-auto">
          {/* Workspace Toolbar Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-lg shadow-black/20">
                <VscEdit className="text-indigo-400 text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                  Code Editor
                </h2>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mt-0.5">
                  Environment /{" "}
                  <span className="text-indigo-400 font-mono lower-case">
                    {language}
                  </span>
                </p>
              </div>
            </div>

            {/* Interactive Runtime Controls */}
            <div className="flex gap-3 items-center w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-sm rounded-xl border border-zinc-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                title={`Reset ${language} code to default`}
              >
                <VscDebugRestart className="text-base text-zinc-400 group-hover:text-zinc-200" />
                Reset
              </button>

              <button
                onClick={handleRun}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl transition-all font-semibold text-sm active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 ${
                  loading
                    ? "bg-indigo-600/40 text-indigo-300/80 cursor-wait shadow-none border border-transparent"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10"
                }`}
=======

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
>>>>>>> origin/main
                title={loading ? "Executing code..." : `Run ${language} code`}
              >
                {loading ? (
                  <>
<<<<<<< HEAD
                    <VscSync className="animate-spin text-base" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <VscPlay className="text-base" />
                    <span>Run Code</span>
=======
                    <VscSync className="animate-spin text-xl" />
                    Running...
                  </>
                ) : (
                  <>
                    <VscPlay className="text-xl" />
                    Run Code
>>>>>>> origin/main
                  </>
                )}
              </button>
            </div>
          </div>
<<<<<<< HEAD

          {/* Code Canvas Viewport Window Wrapper */}
          <div className="rounded-xl border border-zinc-800/80 overflow-hidden shadow-2xl shadow-black/40 bg-[#1e1e1e]">
            <Suspense fallback={<CodeEditorSkeleton />}>
              <CodeEditor
                height="calc(100vh - 300px)"
                extensions={[langExtension]}
                editorInstanceRef={editorInstanceRef}
                language={language}
                socket={socket}
                roomId={roomId}
                codeRef={codeRef}
                defaultValue={defaultCodeSnippets[language]}
              />
            </Suspense>
          </div>

          {/* Console Workspace Component Terminal Layer */}
          <div className="mt-6">
            <OutputConsole output={output} onClear={handleClearOutput} />
          </div>
=======
          <Editor
            value={code}
            height="calc(100vh - 300px)"
            theme="dark"
            extensions={[langExtension]}
            onChange={handleCodeChange}
          />
          <OutputConsole output={output} onClear={handleClearOutput} />
>>>>>>> origin/main
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
