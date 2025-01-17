import React from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button/Button';
import { useApp } from '../../contexts/AppContext';
import { useTheme } from '../../contexts/ThemeContext';
import { logger } from '../../utils/logger';

const Home = () => {
  const { isLoading, error, clearError } = useApp();
  const { darkMode } = useTheme();

  const handleClick = () => {
    logger.info('Home page button clicked');
    // Add your click handler logic here
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <h2 className={`text-2xl font-bold transition-colors duration-theme
          ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
        >
          Welcome to Goal Tracker
        </h2>
        
        {error && (
          <div className={`px-4 py-3 rounded relative transition-colors duration-theme
            ${darkMode 
              ? 'bg-error-dark/20 border border-error-dark text-error-dark' 
              : 'bg-error-light/20 border border-error-light text-error-light'}`}
          >
            {error}
            <button
              className={`absolute top-0 right-0 px-4 py-3 transition-colors duration-theme
                ${darkMode 
                  ? 'text-error-dark hover:text-error-light' 
                  : 'text-error-light hover:text-error-dark'}`}
              onClick={clearError}
            >
              ×
            </button>
          </div>
        )}

        <div className="flex space-x-4">
          <Button onClick={handleClick} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Started'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
