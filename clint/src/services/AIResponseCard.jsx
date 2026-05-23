/**
 * @file AIResponseCard.jsx
 * @description Renders the transformed AI response data from useAIStore.
 *
 * Expected `data` shape (after transformation in aiService.js):
 * {
 *   summary?:        string          — shown for explain + complexity
 *   timeComplexity?: string          — shown for complexity
 *   spaceComplexity?: string         — shown for complexity
 *   items: Array<{
 *     title:       string
 *     description: string            — supports markdown
 *     severity?:   "high"|"medium"|"low"   — bugs only
 *     codeBlock?:  string            — optional syntax-highlighted snippet
 *   }>
 * }
 *
 * `type` prop: "bugs" | "hints" | "optimization" | "explanation" | "complexity"
 */

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  Zap,
  Activity,
  BookOpen,
  Lightbulb,
} from "lucide-react";

// ─── Severity badge ────────────────────────────────────────────────────────────

const getSeverityStyles = (severity) => {
  switch (severity?.toLowerCase()) {
    case "high":
    case "critical":
      return "bg-red-950/50 text-red-400 border-red-800";
    case "medium":
    case "warning":
      return "bg-amber-950/50 text-amber-400 border-amber-800";
    case "low":
    default:
      return "bg-blue-950/50 text-blue-400 border-blue-800";
  }
};

// ─── Icon per section type ─────────────────────────────────────────────────────

const ItemIcon = ({ type }) => {
  switch (type) {
    case "bugs":
      return <ShieldAlert size={14} className="text-red-400 shrink-0" />;
    case "hints":
      return <Lightbulb size={14} className="text-amber-400 shrink-0" />;
    case "optimization":
      return <Zap size={14} className="text-emerald-400 shrink-0" />;
    case "explanation":
      return <BookOpen size={14} className="text-indigo-400 shrink-0" />;
    case "complexity":
      return <Activity size={14} className="text-cyan-400 shrink-0" />;
    default:
      return <Sparkles size={14} className="text-zinc-400 shrink-0" />;
  }
};

// ─── Main component ────────────────────────────────────────────────────────────

export const AIResponseCard = ({ type, data }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!data) return null;

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasItems = Array.isArray(data.items) && data.items.length > 0;

  return (
    <div className="space-y-4 p-1">
      {/* ── Summary block (explain + complexity) ─────────────────────────── */}
      {data.summary && (
        <div className="text-sm text-zinc-400 bg-zinc-900/30 p-3 rounded border border-zinc-800/50 leading-relaxed prose prose-invert max-w-none">
          <ReactMarkdown>{data.summary}</ReactMarkdown>
        </div>
      )}

      {/* ── Complexity grid (type === "complexity") ───────────────────────── */}
      {type === "complexity" &&
        (data.timeComplexity || data.spaceComplexity) && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.timeComplexity && (
              <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded flex items-center gap-2">
                <Activity size={14} className="text-emerald-400" />
                <div>
                  <p className="text-zinc-500">Time Complexity</p>
                  <code className="text-emerald-400 font-mono text-sm">
                    {data.timeComplexity}
                  </code>
                </div>
              </div>
            )}
            {data.spaceComplexity && (
              <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded flex items-center gap-2">
                <Zap size={14} className="text-cyan-400" />
                <div>
                  <p className="text-zinc-500">Space Complexity</p>
                  <code className="text-cyan-400 font-mono text-sm">
                    {data.spaceComplexity}
                  </code>
                </div>
              </div>
            )}
          </div>
        )}

      {/* ── Empty state ───────────────────────────────────────────────────── */}
      {!hasItems && !data.summary && !data.timeComplexity && (
        <p className="text-xs text-zinc-500 text-center py-4">
          No results found.
        </p>
      )}

      {/* ── Item cards ────────────────────────────────────────────────────── */}
      {hasItems && (
        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div
              key={index}
              className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700/80 rounded-lg p-3 transition-all duration-200"
            >
              {/* Card header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium text-zinc-200 flex items-center gap-2">
                  <ItemIcon type={type} />
                  {item.title}
                </h4>

                {/* Severity badge — bugs only */}
                {item.severity && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${getSeverityStyles(
                      item.severity
                    )}`}
                  >
                    {item.severity}
                  </span>
                )}
              </div>

              {/* Description (markdown) */}
              {item.description && (
                <div className="text-xs text-zinc-400 mb-3 leading-relaxed prose prose-invert max-w-none">
                  <ReactMarkdown>{item.description}</ReactMarkdown>
                </div>
              )}

              {/* Optional syntax-highlighted code block */}
              {item.codeBlock && (
                <div className="relative mt-2 rounded overflow-hidden border border-zinc-800 group/code">
                  <button
                    onClick={() => handleCopy(item.codeBlock, index)}
                    className="absolute right-2 top-2 z-10 p-1.5 rounded bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800 opacity-0 group-hover/code:opacity-100 transition-opacity duration-150"
                    title="Copy snippet"
                  >
                    {copiedIndex === index ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                  <SyntaxHighlighter
                    language={data.language || "javascript"}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "12px",
                      fontSize: "11px",
                      backgroundColor: "#121214",
                    }}
                  >
                    {item.codeBlock}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
