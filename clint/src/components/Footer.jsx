import React from "react";

import assets from "./../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-zinc-900 px-6 py-5 text-zinc-500 text-xs shrink-0">
      <div className="max-w-5xl xl:max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        {/* Copyright Statement */}
        <p className="font-mono tracking-tight text-zinc-600">
          &copy; {new Date().getFullYear()} Code Share. All rights reserved.
        </p>

        {/* Connect With Us / Social Icons */}
        <div className="flex flex-col items-center sm:items-end gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            Connect with us
          </p>
          <div className="flex space-x-3">
            <a
              href="https://github.com/amngairola"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900 hover:text-zinc-200 transition-all duration-200 flex items-center justify-center group"
              aria-label="GitHub Profile"
            >
              <img
                src={assets.icon_github}
                alt="GitHub"
                className="w-4 h-4 opacity-50 group-hover:opacity-90 transition-opacity invert tracking-normal"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/amngairola"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/60 hover:border-zinc-700/80 hover:bg-zinc-900 hover:text-zinc-200 transition-all duration-200 flex items-center justify-center group"
              aria-label="LinkedIn Profile"
            >
              <img
                src={assets.linkedin_icon}
                alt="LinkedIn"
                className="w-4 h-4 opacity-50 group-hover:opacity-90 transition-opacity invert tracking-normal"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
