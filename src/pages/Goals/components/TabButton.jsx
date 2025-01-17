import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const TabButton = ({ id, label, count, activeTab, onClick }) => {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={() => onClick(id)}
      className={`relative px-4 py-2 rounded-md transition-all duration-200 
        ${
          activeTab === id
            ? darkMode
              ? "bg-info-dark/10 text-white font-medium"
              : "bg-info-light/5 text-info-light font-medium"
            : darkMode
            ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
            : "text-primary-600 hover:bg-gray-100"
        }`}
    >
      {label}
      {count > 0 && (
        <span
          className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
            darkMode ? "bg-dark-bg-secondary" : "bg-gray-100"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;
