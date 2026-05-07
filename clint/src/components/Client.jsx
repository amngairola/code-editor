import React from "react";

// Helper function to generate a consistent color from a string (e.g., username)
const stringToColor = (str) => {
  let hash = 0;
  if (!str) return "#cccccc"; // Return a default color if string is null/undefined
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
};

const Client = ({ socketId, userName }) => {
  // Generate initials (e.g., "Aman Gairola" -> "AG")
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "?";

  const avatarColor = stringToColor(userName);

  return (
    // Use flex and gap for better spacing between elements
    <div className="flex flex-col items-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 gap-1">
      {/* Custom User Avatar */}
      <div
        className="flex items-center justify-center rounded-full text-white font-bold"
        style={{
          width: "40px",
          height: "40px",
          backgroundColor: avatarColor,
          fontSize: "16px", // Slightly smaller font size for initials
        }}
        title={userName} // Show full name on hover
      >
        {initials}
      </div>

      {/* User Name */}
      <span
        className="text-sm font-medium text-gray-200 truncate w-20 text-center"
        title={userName}
      >
        {userName}
      </span>

      {/* Socket ID - FIX: Added truncate and title for overflow */}
      <span
        className="text-xs text-gray-400 truncate w-20 text-center"
        title={socketId} // Show full socketId on hover
      >
        {socketId}
      </span>
    </div>
  );
};

export default Client;
