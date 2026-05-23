import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import { useParams, useLocation, useNavigate } from "react-router-dom";
const CodeEditor = ({
  defaultValue,
  height,
  language,
  socket,
  roomId,
  codeRef,
  editorInstanceRef,
}) => {
  const isRemote = useRef(false);
  const monacoRef = useRef(null);
  const timeoutRef = useRef(null);
  const location = useLocation();
  const userName =
    location.state?.name || `Guest_${Math.floor(Math.random() * 100)}`;

  // console.log("username : ", location.state?.name);
  const typingTimeout = useRef(null);
  const [userTyping, setTypingUser] = useState(null);

  const handleMount = (editor, monaco) => {
    editorInstanceRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeModelContent((event) => {
      if (isRemote.current) return;

      const operations = event.changes.map((change) => ({
        text: change.text,
        rangeOffset: change.rangeOffset,
        rangeLength: change.rangeLength,
        range: change.range,
      }));

      codeRef.current = editor.getValue();
      // console.log("Emitting operations:", operations);
      socket.emit("code-delta", {
        roomId,
        operations,
      });

      socket.emit("typing", {
        roomId,
        userName,
      });
    });

    // const handleDelta = ({ operations }) => {
    //   console.log("Received payload:", operations);
    //   if (!operations || !Array.isArray(operations)) {
    //     console.warn("Received invalid operations:", operations);
    //     return;
    //   }
    //   const editor = editorInstanceRef.current;
    //   const monaco = monacoRef.current;
    //   if (!editor || !monaco) return;

    //   isRemote.current = true;

    //   const edits = operations.map((op) => ({
    //     range: new monaco.Range(
    //       op.range.startLineNumber,
    //       op.range.startColumn,
    //       op.range.endLineNumber,
    //       op.range.endColumn
    //     ),

    //     text: op.text,
    //     forceMoveMarkers: true,
    //   }));

    //   editor.executeEdits("remote", edits);

    //   const selections = editor.getSelections();
    //   if (selections) {
    //     editor.setSelections(selections);
    //   }

    //   codeRef.current = editor.getValue();

    //   isRemote.current = false;
    // };
    // socket.on("code-delta", handleDelta);

    // socket.onAny((event, ...args) => {
    //   console.log("ANY EVENT:", event, args);
    // });

    return () => {
      socket.off("code-delta", handleDelta);
    };
  };

  useEffect(() => {
    const handleDelta = ({ operations }) => {
      console.log("Received payload:", operations);
      if (!operations || !Array.isArray(operations)) {
        console.warn("Received invalid operations:", operations);
        return;
      }
      const editor = editorInstanceRef.current;
      const monaco = monacoRef.current;
      if (!editor || !monaco) return;

      isRemote.current = true;

      const edits = operations.map((op) => ({
        range: new monaco.Range(
          op.range.startLineNumber,
          op.range.startColumn,
          op.range.endLineNumber,
          op.range.endColumn
        ),

        text: op.text,
        forceMoveMarkers: true,
      }));

      editor.executeEdits("remote", edits);

      const selections = editor.getSelections();
      if (selections) {
        editor.setSelections(selections);
      }

      codeRef.current = editor.getValue();

      isRemote.current = false;
    };

    const handleTyping = ({ userName }) => {
      console.log(userName, "is typing...");
      setTypingUser(userName);
    };

    socket.on("code-delta", handleDelta);

    socket.on("user-typing", handleTyping);

    return () => {
      socket.off("code-delta", handleDelta);
      socket.off("user-typing", handleTyping);
    };
  }, [socket]);

  clearTimeout(timeoutRef.current);

  timeoutRef.current = setTimeout(() => {
    setTypingUser("");
  }, 800);

  useEffect(() => {
    return () => {
      socket?.off("code-delta");
    };
  }, [socket]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-800/80 bg-[#1e1e1e] shadow-2xl transition-all duration-300 group focus-within:border-zinc-700/80 focus-within:ring-4 focus-within:ring-indigo-500/5">
      {/* Subtly animated accent indicator tracking focus activity inside the block */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-indigo-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

      {/* Monaco Code Stream Viewport Canvas */}
      <Editor
        height={height}
        language={language}
        theme="vs-dark"
        defaultValue={defaultValue}
        onMount={handleMount}
        options={{
          fontSize: 14,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          fontLigatures: true,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          padding: {
            top: 16,
            bottom: 16,
          } /* Slightly optimized internal line vertical buffers */,
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          readOnly: false,
          lineNumbers: "on",
          tabSize: 2,
          automaticLayout: true,
        }}
      />

      {/* Elegant Collaborative Real-time Typing Badge */}
      {userTyping && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-lg backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 select-none">
          {/* Pulsing Presence Indicator Ring */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>

          {/* Active Session Meta String */}
          <p className="text-[11px] font-semibold text-zinc-300 tracking-wide">
            <span className="text-indigo-400 font-mono font-bold mr-0.5">
              {userTyping}
            </span>{" "}
            is typing
          </p>

          {/* CSS Typing Wave Ellipsis Animation dot sequence */}
          <div className="flex gap-0.5 items-center ml-0.5">
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-zinc-500 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
