import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete',
  isLoading = false 
}) => {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Dialog */}
        <div 
          className={`relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6
            ${darkMode ? 'bg-dark-bg-primary border border-dark-border' : 'bg-white'}`}
        >
          <div className="sm:flex sm:items-start">
            {/* Warning Icon */}
            <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10
              ${darkMode ? 'bg-error-dark/10' : 'bg-error-light/10'}`}
            >
              <svg 
                className={`w-6 h-6 ${darkMode ? 'text-error-dark' : 'text-error-light'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            {/* Content */}
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 
                className={`text-lg font-medium leading-6 
                  ${darkMode ? 'text-dark-text-primary' : 'text-gray-900'}`}
                id="modal-title"
              >
                {title}
              </h3>
              <div className="mt-2">
                <p className={`text-sm ${darkMode ? 'text-dark-text-secondary' : 'text-gray-500'}`}>
                  {message}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={isLoading}
              onClick={onConfirm}
              className={`inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white rounded-md sm:ml-3 sm:w-auto sm:text-sm
                ${darkMode 
                  ? 'bg-error-dark hover:bg-error-dark/90 focus:ring-error-dark' 
                  : 'bg-error-light hover:bg-error-light/90 focus:ring-error-light'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200`}
            >
              {isLoading ? (
                <svg className="w-5 h-5 mr-3 -ml-1 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {confirmText}
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className={`inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium rounded-md sm:mt-0 sm:w-auto sm:text-sm
                ${darkMode
                  ? 'bg-dark-bg-secondary text-dark-text-primary hover:bg-dark-bg-tertiary focus:ring-dark-bg-tertiary'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 focus:ring-primary-500'
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
