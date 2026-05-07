import React from "react";
import CodeMirror from "@uiw/react-codemirror";

export default function Editor({
  value,
  height = "400px",
  theme = "dark",
  extensions,
  onChange,
}) {
  return (
    <div className="code-editor-wrapper">
      <CodeMirror
        value={value}
        height={height}
        theme={theme}
        extensions={extensions}
        onChange={onChange}
      />
    </div>
  );
}
