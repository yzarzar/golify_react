import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const AddGoalCard = ({ onClick }) => {
  const { darkMode } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`rounded-lg p-6 flex items-center justify-center transition-colors duration-theme min-h-[280px]
      ${
        darkMode
          ? "border-2 border-dashed border-dark-border hover:border-dark-text-accent"
          : "border-2 border-dashed border-primary-300 hover:border-info-light"
      }`}
    >
      <div
        className={`transition-colors duration-theme
        ${
          darkMode
            ? "text-dark-text-secondary hover:text-dark-text-accent"
            : "text-primary-500 hover:text-info-light"
        }`}
      >
        <svg
          className="mx-auto w-12 h-12 rounded-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="block mt-2">Add New Goal</span>
      </div>
    </button>
  );
};

export default AddGoalCard;
