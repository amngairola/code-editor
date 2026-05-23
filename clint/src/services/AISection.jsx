import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, RefreshCw, AlertCircle, Inbox } from "lucide-react";
import { useAIStore } from "../store/useAIStore";
import { AIResponseCard } from "./AIResponseCard";
import { LoadingSkeleton } from "./../components/AI/LoadingSkeleton";

export const AISection = ({ id, title, icon: Icon, getCodeContext }) => {
  const { activeSection, setActiveSection, fetchAIAnalysis } = useAIStore();
  const sectionData = useAIStore((state) => state[id]);

  const isOpen = activeSection === id;
  const { data, loading, error } = sectionData || {};

  // Fetch on first open (not cached yet)
  useEffect(() => {
    if (isOpen && !data && !loading && !error) {
      // Call the getter HERE — right before the network request
      fetchAIAnalysis(id, getCodeContext());
    }
  }, [isOpen]); // intentionally minimal deps — getter is stable via useCallback

  const handleRefresh = (e) => {
    e.stopPropagation();
    fetchAIAnalysis(id, getCodeContext(), true); // forceRefresh = true
  };

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-900/20">
      {/* Accordion header */}
      <div
        onClick={() => setActiveSection(id)}
        className={`w-full flex items-center justify-between px-4 py-3 cursor-pointer text-left transition-colors duration-150 select-none ${
          isOpen
            ? "bg-zinc-800/30 text-zinc-100"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <Icon
            size={16}
            className={isOpen ? "text-indigo-400" : "text-zinc-500"}
          />
          <span className="text-xs font-semibold tracking-wide uppercase">
            {title}
          </span>

          {/* Item count badge — only when data is loaded */}
          {data?.items?.length > 0 && (
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-full">
              {data.items.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button — only visible once data has been fetched */}
          {(data || error) && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-all duration-150 disabled:opacity-40"
              title="Refresh insights"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          )}

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronDown size={14} className="text-zinc-500" />
          </motion.div>
        </div>
      </div>

      {/* Accordion body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden bg-zinc-950/40"
          >
            <div className="p-4 border-t border-zinc-900/60 max-h-[500px] overflow-y-auto custom-scrollbar">
              {/* Loading skeleton */}
              {loading && <LoadingSkeleton />}

              {/* Error state */}
              {!loading && error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <div className="space-y-2 w-full">
                    <p className="font-medium">Analysis Failed</p>
                    <p className="text-red-300/80 leading-relaxed">{error}</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-1 px-2.5 py-1 bg-red-900/40 hover:bg-red-900/60 text-red-200 rounded border border-red-800 font-medium transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Empty / not yet fetched */}
              {!loading && !error && !data && (
                <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-600">
                  <Inbox size={24} className="mb-2 stroke-[1.5]" />
                  <p className="text-xs">No insights generated yet.</p>
                </div>
              )}

              {/* Results */}
              {!loading && !error && data && (
                <AIResponseCard type={id} data={data} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
