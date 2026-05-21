import React from "react";
import SideBarBottom from "./SideBarBottom";
import Client from "../Client";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const LeftSIdeBar = React.memo(({ width, clients, language, setLanguage }) => {
  const { roomId } = useParams();

  console.log(clients, language);
  return (
    <div
      className={`h-screen w-${width} bg-[#0c0c0e] border-r border-zinc-800 p-5 flex flex-col justify-between select-none shrink-0`}
    >
      <div>
        {/* Room Identity Section */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Room ID
          </h4>
          <div className="bg-zinc-900/50 border border-zinc-800 text-zinc-200 px-4 py-3 rounded-xl text-center font-mono text-sm font-semibold break-all shadow-inner tracking-tight">
            {roomId}
          </div>
        </div>

        {/* Collaborators Workspace Section */}
        <div className="mt-8">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-4">
            Collaborators
          </h4>
          <div className="grid grid-cols-2 gap-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-1 custom-scrollbar">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                socketId={client.socketId}
                userName={client.userName}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Integrated Footer Controls Area */}
      <div className="border-t border-zinc-800/60 pt-5 mt-auto">
        <SideBarBottom language={language} setLanguage={setLanguage} />
      </div>
    </div>
  );
});

export default LeftSIdeBar;
