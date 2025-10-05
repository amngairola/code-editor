import React from "react";

import { icon_github, icon_linkedin } from "../assets/assets.js";
const Footer = () => {
  return (
    <footer className="bg-gray-800 p-6 text-gray-300 text-center text-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Copyright or Brand Info */}
        <p>
          &copy; {new Date().getFullYear()} Code Share. All rights reserved.
        </p>

        {/* Connect With Us / Social Icons */}
        <div className="flex flex-col items-center sm:items-end">
          <p className="mb-2">Connect with us</p>
          <div className="flex space-x-4">
            <a
              href="https://github.com/amngairola"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity duration-200"
              aria-label="GitHub Profile" // Accessibility
            >
              <img src={icon_github} alt="GitHub" className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/amngairola"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-75 transition-opacity duration-200"
              aria-label="LinkedIn Profile" // Accessibility
            >
              <img src={icon_linkedin} alt="LinkedIn" className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
