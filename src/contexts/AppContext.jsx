import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { logger } from '../utils/logger';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleError = (error) => {
    logger.error('Application error:', error);
    setError(error.message);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isLoading,
    setIsLoading,
    error,
    handleError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
