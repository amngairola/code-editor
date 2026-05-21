import React from "react";

const CodeEditorSkeleton = () => {
  // Simulating 14 lines of code with different lengths and indentation levels
  const skeletonLines = [
    { indent: "pl-0", width: "w-1/3" },
    { indent: "pl-0", width: "w-1/4" },
    { indent: "pl-4", width: "w-2/3" },
    { indent: "pl-8", width: "w-1/2" },
    { indent: "pl-8", width: "w-3/4" },
    { indent: "pl-4", width: "w-1/4" },
    { indent: "pl-4", width: "w-2/5" },
    { indent: "pl-8", width: "w-4/5" },
    { indent: "pl-12", width: "w-1/3" },
    { indent: "pl-8", width: "w-1/4" },
    { indent: "pl-4", width: "w-1/2" },
    { indent: "pl-0", width: "w-1/5" },
    { indent: "pl-4", width: "w-2/3" },
    { indent: "pl-0", width: "w-1/6" },
  ];

  return (
    <div className="w-full h-[500px] bg-[#1e1e1e] border border-zinc-800 rounded-xl overflow-hidden font-mono flex flex-col relative select-none shadow-2xl">
      {/* Editor Top Mini-Bar / Tab Strip */}
      <div className="h-9 border-b border-[#2d2d2d] bg-[#181818] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Active File Tab Mock */}
          <div className="h-9 px-4 bg-[#1e1e1e] border-t-2 border-indigo-500 flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <div className="w-3 h-3 rounded bg-zinc-800 animate-pulse" />
            <div className="h-3 w-16 bg-zinc-800 rounded animate-pulse" />
          </div>
        </div>
        {/* Mock Controls */}
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2d2d2d]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2d2d2d]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#2d2d2d]" />
        </div>
      </div>

      {/* Main Editor Screen Area */}
      <div className="flex-1 flex overflow-hidden p-4 relative">
        {/* Line Numbers Gutter */}
        <div className="flex flex-col text-right pr-4 border-r border-[#2d2d2d] text-[#5a5a5a] text-xs leading-6 select-none unselectable shrink-0 space-y-1">
          {skeletonLines.map((_, index) => (
            <span
              key={index}
              className="w-6 block text-zinc-700 font-medium tracking-tighter"
            >
              {index + 1}
            </span>
          ))}
        </div>

        {/* Shimmering Code Blocks */}
        <div className="flex-1 pl-4 space-y-1 pt-0.5 overflow-hidden">
          {skeletonLines.map((line, index) => (
            <div key={index} className={`flex items-center h-6 ${line.indent}`}>
              <div
                className={`h-3.5 bg-zinc-800/60 rounded-md relative overflow-hidden ${line.width} code-shimmer`}
              />
            </div>
          ))}
        </div>

        {/* Mock Minimap Sidebar */}
        <div className="w-16 border-l border-[#2d2d2d] ml-4 shrink-0 opacity-20 hidden sm:flex flex-col space-y-1 py-1 px-1.5 select-none">
          {skeletonLines.map((line, index) => (
            <div key={index} className={`flex ${line.indent}`}>
              <div className={`h-1 bg-zinc-700 rounded-sm ${line.width}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Editor Status Bar Footer */}
      <div className="h-6 bg-[#007acc]/10 border-t border-zinc-800 px-4 flex items-center justify-between text-[10px] text-zinc-600 font-medium shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-2 w-12 bg-zinc-800 rounded animate-pulse" />
          <div className="h-2 w-8 bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="h-2 w-20 bg-zinc-800 rounded animate-pulse" />
      </div>

      {/* Embedded Shimmer Keyframes */}
      <style jsx>{`
        @keyframes codeShimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        .code-shimmer {
          background: linear-gradient(
            90deg,
            rgba(39, 39, 42, 0.4) 25%,
            rgba(63, 63, 70, 0.6) 50%,
            rgba(39, 39, 42, 0.4) 75-px
          );
          background-size: 400px 100%;
          animation: codeShimmer 1.8s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default CodeEditorSkeleton;
