import React, {
  useEffect,
  useState,
  useRef,
  Suspense,
  lazy,
  useMemo,
} from "react";
import { toast } from "react-toastify";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

// Import custom components
import Client from "../components/Client";

import OutputConsole from "../components/OutputConsole";

// // Import CodeMirror language packages
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

// Import icons for the UI
import { VscEdit, VscDebugRestart, VscPlay, VscSync } from "react-icons/vsc";
import axios from "axios";
const LeftSIdeBar = lazy(() =>
  import("../components/ParentComponents/LeftSIdeBar")
);

import LeftSideBarSkeleton from "../components/LeftSideBarSkeleton";

const CodeEditor = lazy(() => import("../components/CodeEditor"));
import CodeEditorSkeleton from "../components/CodeEditorSkeleto";

// default code snippet for languages
const defaultCodeSnippets = {
  javascript: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  java: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const EditorPage = () => {
  const socket = useSocket();
  const codeRef = useRef(defaultCodeSnippets.javascript);
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editorInstanceRef = useRef(null);

  // State for UI and application logic
  const [clients, setClients] = useState([]);
  const [language, setLanguage] = useState("javascript");
  // const [code, setCode] = useState(defaultCodeSnippets.javascript);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [langExtension, setLangExtension] = useState(javascript({ jsx: true }));

  const isRemoteUpdate = useRef(false);

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
        codeRef.current = serverCode;

        if (editorInstanceRef.current) {
          const pos = editorInstanceRef.current.getPosition();
          editorInstanceRef.current.setValue(serverCode);
          editorInstanceRef.current.setPosition(pos);
        }
      }
    };
    socket.on("code-update", handleCodeUpdate);

    // 4. Listen for output console updates from other users
    const handleOutputUpdate = ({ output: serverOutput }) => {
      isRemoteUpdate.current = true;
      if (serverOutput !== null) {
        setOutput(serverOutput);
      }
      isRemoteUpdate.current = false;
    };
    socket.on("output-update", handleOutputUpdate);

    // --- CLEANUP ---

    return () => {
      socket.off("joined", handleJoined);
      socket.off("disconnected", handleDisconnected);
      socket.off("code-update", handleCodeUpdate);
      socket.off("output-update", handleOutputUpdate);
    };
  }, [socket, roomId, location.state, navigate]);

  // Effect to update editor settings when the language dropdown changes
  useEffect(() => {
    const newCode = defaultCodeSnippets[language] || "";
    codeRef.current = newCode; // Set the default code for the new language
    setOutput("");

    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(newCode);
    }

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

  const handleCodeChange = (newCode) => {
    codeRef.current = newCode;
    if (!isRemoteUpdate.current && socket) {
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
    codeRef.current = defaultCode;

    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(defaultCode);
    }

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

    const code = codeRef.current;
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
  const memoizedClients = useMemo(() => clients, [clients]);
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 flex flex-col font-sans antialiased selection:bg-indigo-500/30">
      <div className="flex-grow flex overflow-hidden">
        {/* Left Sidebar Layout Frame */}
        <Suspense fallback={<LeftSideBarSkeleton />}>
          <LeftSIdeBar
            clients={memoizedClients}
            language={language}
            setLanguage={setLanguage}
          />
        </Suspense>

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
                title={loading ? "Executing code..." : `Run ${language} code`}
              >
                {loading ? (
                  <>
                    <VscSync className="animate-spin text-base" />
                    <span>Running...</span>
                  </>
                ) : (
                  <>
                    <VscPlay className="text-base" />
                    <span>Run Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
