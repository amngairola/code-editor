import React from "react";
import { VscDebugConsole, VscTrash } from "react-icons/vsc";

/**
 *
 *
 * @param {object} props - Component props.
 * @param {string} props.output - The string content to display in the console.
 * @param {function} props.onClear - A function to call when the "Clear" button is clicked.
 */

export default function OutputConsole({ output, onClear }) {
  return (
<<<<<<< HEAD
    <div className="mt-6 bg-[#09090b] rounded-xl shadow-2xl border border-zinc-800/80 flex flex-col overflow-hidden">
      {/* Terminal Action Header Tab */}
      <div className="bg-[#0c0c0e] px-4 py-2.5 flex items-center justify-between border-b border-zinc-800/80">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <VscDebugConsole className="text-indigo-400 text-base" />
          Console Output
        </h2>

        {/* Clear Workspace Stream Button */}
        <button
          onClick={onClear}
          className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 border border-transparent hover:border-red-500/10 active:scale-[0.98]"
          title="Clear Output"
        >
          <VscTrash className="text-sm" />
=======
    <div className="mt-8 bg-gray-900 rounded-lg shadow-2xl border border-gray-700 flex flex-col overflow-hidden">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <VscDebugConsole className="text-blue-400 text-xl" /> Output
        </h2>

        {/* Clear Button */}
        <button
          onClick={onClear}
          className="text-gray-400 hover:text-red-400 transition-colors duration-200 text-sm flex items-center gap-1 p-1 rounded-md hover:bg-gray-700"
          title="Clear Output"
        >
          <VscTrash className="text-lg" />
>>>>>>> origin/main
          Clear
        </button>
      </div>

<<<<<<< HEAD
      {/* Terminal Code Content Output Window Container */}
      <pre className="flex-grow p-5 text-zinc-300 font-mono text-sm tracking-normal leading-relaxed whitespace-pre-wrap max-h-64 min-h-[120px] overflow-y-auto bg-black/40 custom-scrollbar shadow-inner">
        {output ? (
          <span className="text-emerald-400/90">{output}</span>
        ) : (
          <span className="text-zinc-600 italic select-none">
            Output will appear here after code execution...
          </span>
        )}
=======
      <pre className="flex-grow p-4 text-gray-300 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto bg-gray-900">
        {/* Display output, or a descriptive placeholder message if output is empty */}
        {output || "Output will appear here after code execution..."}
>>>>>>> origin/main
      </pre>
    </div>
  );
}
