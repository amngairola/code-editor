import React, { useCallback } from "react";
import { useAIStore } from "../store/useAIStore.js";
import { AISection } from "./AISection";
import {
  ShieldAlert,
  Lightbulb,
  Zap,
  BookOpen,
  Activity,
  Sparkles,
  ChevronRight,
  PanelRightClose,
} from "lucide-react";

// Section config — add explanation / complexity here too if you want them
const AI_SECTIONS = [
  { id: "bugs", title: "Bug Detection", icon: ShieldAlert },
  { id: "hints", title: "Logic Hints", icon: Lightbulb },
  { id: "optimization", title: "Optimization", icon: Zap },
  { id: "explanation", title: "Explain Code", icon: BookOpen },
  { id: "complexity", title: "Complexity Analysis", icon: Activity },
];

export const AIPanel = ({ codeRef, currentLanguage, roomId }) => {
  const { isOpen, togglePanel } = useAIStore();

  /**
   * Getter instead of snapshot.
   * AISection calls this RIGHT before the fetch — always gets latest code.
   */
  const getCodeContext = useCallback(
    () => ({
      code: codeRef.current,
      language: currentLanguage,
      roomId,
    }),
    [codeRef, currentLanguage, roomId]
  );

  return (
    <>
      {/* Collapsed trigger */}
      {!isOpen && (
        <button
          onClick={togglePanel}
          className="fixed right-0 top-20 z-40 bg-zinc-900 hover:bg-zinc-800 border-l border-t border-b border-zinc-800 text-zinc-400 hover:text-zinc-200 p-2 rounded-l-md shadow-xl transition-all duration-150 flex items-center justify-center"
          title="Open AI Copilot"
        >
          <Sparkles size={16} className="text-indigo-400 animate-pulse mr-1" />
          <ChevronRight size={14} className="rotate-180" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen z-40 bg-zinc-950 border-l border-zinc-900 flex flex-col transition-all duration-300 shadow-2xl ${
          isOpen
            ? "w-full md:w-[380px] lg:w-[420px]"
            : "w-0 pointer-events-none border-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-900 bg-zinc-900/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-500/10 rounded-md">
              <Sparkles size={16} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Copilot Assistant
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono">
                Room: {roomId?.substring(0, 8)}...
              </p>
            </div>
          </div>
          <button
            onClick={togglePanel}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-900 transition-colors"
            title="Hide Side Panel"
          >
            <PanelRightClose size={16} />
          </button>
        </div>

        {/* Accordion sections */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 custom-scrollbar">
          {AI_SECTIONS.map((section) => (
            <AISection
              key={section.id}
              id={section.id}
              title={section.title}
              icon={section.icon}
              getCodeContext={getCodeContext} // ← getter, not snapshot
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-900/10 text-[10px] text-zinc-500 font-mono flex items-center justify-between shrink-0">
          <span>Context: {currentLanguage}</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Real-time ready
          </span>
        </div>
      </div>
    </>
  );
};
