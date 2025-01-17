import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const SearchBar = ({ value, onChange }) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex items-center p-2 rounded-lg transition-colors duration-theme
      ${
        darkMode
          ? "border bg-dark-bg-secondary border-dark-border"
          : "bg-white border border-gray-200"
      }`}
    >
      <svg
        className={`w-5 h-5 ${
          darkMode ? "text-dark-text-secondary" : "text-gray-400"
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search goals..."
        value={value}
        onChange={onChange}
        className={`ml-2 w-full bg-transparent outline-none transition-colors duration-theme
          ${
            darkMode
              ? "text-dark-text-primary placeholder-dark-text-secondary"
              : "placeholder-gray-500 text-gray-900"
          }`}
      />
    </div>
  );
};

export default SearchBar;
