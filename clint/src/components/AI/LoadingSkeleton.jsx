import React from "react";

export const LoadingSkeleton = () => {
  return (
    <div className="space-y-4 p-2 animate-pulse">
      {/* Summary Skeleton */}
      <div className="h-4 bg-zinc-800 rounded w-3/4 mb-4"></div>
      <div className="h-3 bg-zinc-800 rounded w-5/6"></div>

      {/* Card Skeletons */}
      {[1, 2].map((i) => (
        <div
          key={i}
          className="border border-zinc-800 bg-zinc-900/50 p-3 rounded-lg space-y-3"
        >
          <div className="flex justify-between items-center">
            <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
            <div className="h-5 bg-zinc-800 rounded-full w-16"></div>
          </div>
          <div className="h-3 bg-zinc-800 rounded w-full"></div>
          <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
          <div className="pt-2">
            <div className="h-16 bg-zinc-800/70 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
