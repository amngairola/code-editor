import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

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
      console.log("Emitting operations:", operations);
      socket.emit("code-delta", {
        roomId,
        operations,
      });
    });

    socket.on("code-delta", ({ operations }) => {
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
    });

    socket.onAny((event, ...args) => {
      console.log("ANY EVENT:", event, args);
    });
  };

  useEffect(() => {
    return () => {
      socket?.off("code-delta");
    };
  }, [socket]);

  return (
    <Editor
      height={height}
      language={language}
      theme="vs-dark"
      defaultValue={defaultValue}
      onMount={handleMount}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        readOnly: false,
        lineNumbers: "on", // "on" | "off" | "relative"
        tabSize: 2,
        automaticLayout: true, // resizes with container
      }}
    />
  );
};

export default CodeEditor;
