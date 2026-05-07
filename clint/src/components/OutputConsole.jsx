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
          Clear
        </button>
      </div>

      <pre className="flex-grow p-4 text-gray-300 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto bg-gray-900">
        {/* Display output, or a descriptive placeholder message if output is empty */}
        {output || "Output will appear here after code execution..."}
      </pre>
    </div>
  );
}
