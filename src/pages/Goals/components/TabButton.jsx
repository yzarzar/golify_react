import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const TabButton = ({ id, label, count, isActive, onClick }) => {
  const { darkMode } = useTheme();

  const getTabIcon = () => {
    switch (id) {
      case 'all':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        );
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'in-progress':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'complete':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
        ${isActive
          ? darkMode
            ? "bg-primary-dark text-white shadow-md shadow-primary-dark/20"
            : "bg-primary-light text-white shadow-md shadow-primary-light/20"
          : darkMode
            ? "text-gray-400 hover:text-white hover:bg-dark-bg-secondary"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }
        transform hover:scale-105 active:scale-95
      `}
    >
      <span className={`transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
        {getTabIcon()}
      </span>
      <span className="font-medium">{label}</span>
      {count > 0 && (
        <span
          className={`
            ml-1.5 px-2 py-0.5 text-xs font-medium rounded-full transition-all duration-200
            ${isActive
              ? "bg-white/20 text-white"
              : darkMode
                ? "bg-dark-bg-secondary text-gray-400"
                : "bg-gray-200 text-gray-600"
            }
            ${isActive ? "scale-110" : "group-hover:scale-110"}
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default TabButton;
