import React from 'react';
import PropTypes from 'prop-types';
import { logger } from '../utils/logger';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ toggleSidebar, isSidebarCollapsed }) => {
  logger.debug('Rendering Header');
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header 
      className={`shadow-md z-20 sticky top-0 transition-colors duration-theme
        ${darkMode ? 'border-b bg-dark-bg-secondary border-dark-border' : 'bg-accent-light'}
      `}
    >
      <div className="flex justify-between items-center px-4 max-w-full h-16 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className={`transition-colors duration-theme focus:outline-none focus:ring-2 
              ${darkMode 
                ? 'text-dark-text-primary hover:text-dark-text-accent focus:ring-dark-text-accent' 
                : 'text-white hover:text-primary-100 focus:ring-white/50'
              } p-2 rounded-md`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isSidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
          <h1 className={`ml-4 text-2xl font-bold ${darkMode ? 'text-dark-text-primary' : 'text-white'}`}>
            Goal Tracker
          </h1>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-theme
              ${darkMode 
                ? 'bg-dark-bg-tertiary hover:bg-dark-bg-primary text-dark-text-accent' 
                : 'text-white bg-white/10 hover:bg-white/20'
              } focus:outline-none focus:ring-2 focus:ring-white/50`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  isSidebarCollapsed: PropTypes.bool.isRequired,
};

export default Header;
