import React from 'react';
import { logger } from '../../utils/logger';
import { useTheme } from '../../contexts/ThemeContext';

const Achievements = () => {
  logger.debug('Rendering Achievements page');
  const { darkMode } = useTheme();

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-6 transition-colors duration-theme
        ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
      >
        My Achievements
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Achievement Cards */}
        <div className={`card`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto transition-colors duration-theme
            ${darkMode ? 'bg-info-dark/20' : 'bg-info-light/20'}`}
          >
            <svg className={`w-8 h-8 transition-colors duration-theme
              ${darkMode ? 'text-info-dark' : 'text-info-light'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold text-center mb-2 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
          >
            First Goal Completed
          </h3>
          <p className={`text-center mb-4 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-600'}`}
          >
            Successfully completed your first learning goal!
          </p>
          <div className={`text-sm text-center transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-500'}`}
          >
            Achieved on January 10, 2024
          </div>
        </div>

        <div className={`card`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto transition-colors duration-theme
            ${darkMode ? 'bg-success-dark/20' : 'bg-success-light/20'}`}
          >
            <svg className={`w-8 h-8 transition-colors duration-theme
              ${darkMode ? 'text-success-dark' : 'text-success-light'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold text-center mb-2 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
          >
            Perfect Week
          </h3>
          <p className={`text-center mb-4 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-600'}`}
          >
            Completed all planned tasks for an entire week!
          </p>
          <div className={`text-sm text-center transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-500'}`}
          >
            Achieved on January 7, 2024
          </div>
        </div>

        {/* Locked Achievement */}
        <div className={`opacity-50 card`}>
          <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 mx-auto transition-colors duration-theme
            ${darkMode ? 'bg-dark-bg-tertiary' : 'bg-primary-100'}`}
          >
            <svg className={`w-8 h-8 transition-colors duration-theme
              ${darkMode ? 'text-dark-text-secondary' : 'text-primary-400'}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className={`text-lg font-semibold text-center mb-2 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
          >
            Goal Master
          </h3>
          <p className={`text-center mb-4 transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-600'}`}
          >
            Complete 10 goals to unlock this achievement
          </p>
          <div className={`text-sm text-center transition-colors duration-theme
            ${darkMode ? 'text-dark-text-secondary' : 'text-primary-400'}`}
          >
            Progress: 3/10 goals
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8">
        <h2 className={`text-xl font-semibold mb-4 transition-colors duration-theme
          ${darkMode ? 'text-dark-text-primary' : 'text-primary-900'}`}
        >
          Achievement Progress
        </h2>
        <div className="card">
          <div className="space-y-4">
            <div>
              <div className={`flex justify-between text-sm mb-1 transition-colors duration-theme
                ${darkMode ? 'text-dark-text-secondary' : 'text-primary-600'}`}
              >
                <span>Total Achievements</span>
                <span>2/10</span>
              </div>
              <div className={`w-full h-2.5 rounded-full transition-colors duration-theme
                ${darkMode ? 'bg-dark-bg-tertiary' : 'bg-primary-100'}`}
              >
                <div className={`h-2.5 rounded-full transition-colors duration-theme
                  ${darkMode ? 'bg-info-dark' : 'bg-info-light'}`} 
                  style={{ width: '20%' }}
                >
                </div>
              </div>
            </div>
            <div>
              <div className={`flex justify-between text-sm mb-1 transition-colors duration-theme
                ${darkMode ? 'text-dark-text-secondary' : 'text-primary-600'}`}
              >
                <span>Weekly Streak</span>
                <span>1/4 weeks</span>
              </div>
              <div className={`w-full h-2.5 rounded-full transition-colors duration-theme
                ${darkMode ? 'bg-dark-bg-tertiary' : 'bg-primary-100'}`}
              >
                <div className={`h-2.5 rounded-full transition-colors duration-theme
                  ${darkMode ? 'bg-success-dark' : 'bg-success-light'}`} 
                  style={{ width: '25%' }}
                >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
