import React from "react";

const LeftSideBarSkeleton = () => {
  // Simulating 4 collaborator badge slots
  const skeletonCollaborators = [1, 2, 3, 4];

  return (
    <div className="w-64 h-screen bg-[#0c0c0e] border-r border-zinc-800 p-5 flex flex-col justify-between select-none animate-pulse">
      {/* Top Content Panel */}
      <div className="space-y-6">
        {/* Room ID Section */}
        <div className="space-y-2.5">
          <div className="h-4 w-20 bg-zinc-800 rounded-md" />
          <div className="h-11 w-full bg-zinc-900 border border-zinc-800/80 rounded-xl flex items-center justify-center">
            <div className="h-3 w-28 bg-zinc-800 rounded" />
          </div>
        </div>

        {/* Separator / Margin spacer mimicking the mt-6 */}
        <div className="pt-2">
          {/* Collaborators Heading */}
          <div className="h-4 w-28 bg-zinc-800 rounded-md mb-4" />

          {/* Grid Layout mimicking Client component layout */}
          <div className="grid grid-cols-2 gap-4">
            {skeletonCollaborators.map((i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center p-3 bg-zinc-900/50 border border-zinc-800/40 rounded-xl space-y-2"
              >
                {/* Avatar circle skeleton */}
                <div className="w-10 h-10 rounded-full bg-zinc-800" />
                {/* Username label skeleton */}
                <div className="h-2.5 w-14 bg-zinc-800/80 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Content Panel mimicking SideBarBottom items (Language dropdown + buttons) */}
      <div className="border-t border-zinc-800/60 pt-5 space-y-4">
        {/* Dropdown label & input window */}
        <div className="space-y-2">
          <div className="h-3 w-16 bg-zinc-800/70 rounded" />
          <div className="h-10 w-full bg-zinc-900 border border-zinc-800 rounded-xl" />
        </div>

        {/* Sidebar utility action buttons (e.g. Copy ID, Leave Room) */}
        <div className="space-y-2.5">
          <div className="h-10 w-full bg-zinc-800/60 rounded-xl" />
          <div className="h-10 w-full bg-zinc-900 border border-zinc-800/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default LeftSideBarSkeleton;
