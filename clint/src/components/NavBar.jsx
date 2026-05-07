import React from "react";

const NavBar = ({ userName = "Guest", isLoggedIn = false }) => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
      {/* Logo/Site Name */}
      <div className="flex items-center">
        <div className="bg-green-500 w-6 h-6 rounded-md mr-2 flex items-center justify-center">
          <span className="text-white font-bold text-sm">CS</span>
        </div>
        <h1 className="text-white text-xl font-semibold tracking-wide">
          CODE SHARE
        </h1>{" "}
        {/* Added tracking-wide for better spacing */}
      </div>

      {/* User Information / Status */}
      <div className="flex items-center space-x-4">
        {/* Placeholder for Dashboard link - visible even if not logged in, but might lead to login if clicked */}
        <a
          href="#"
          className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
        >
          Dashboard
        </a>

        {/* Conditional rendering for user icon based on isActive / isLoggedIn */}
        {isLoggedIn ? ( // You would manage `isLoggedIn` state in your app
          <div className="flex items-center space-x-2">
            <span className="text-gray-300 text-sm md:text-base hidden sm:block">
              Hello, {userName}
            </span>{" "}
            {/* Shows name on medium screens */}
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:bg-blue-600 transition-colors duration-200">
              {getInitials(userName)}
            </div>
          </div>
        ) : (
          // If not logged in, show a simple Login button/link
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200 text-sm md:text-base"
          >
            Login
          </a>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
