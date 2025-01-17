import React from 'react';
import { logger } from '../../utils/logger';
import { useTheme } from '../../contexts/ThemeContext';

const Milestones = () => {
  logger.debug('Rendering Milestones page');
  const { darkMode } = useTheme();

  const textPrimary = darkMode ? 'text-dark-text-primary' : 'text-primary-900';
  const textSecondary = darkMode ? 'text-dark-text-secondary' : 'text-primary-600';
  const bgTertiary = darkMode ? 'bg-dark-bg-tertiary' : 'bg-primary-100';
  const transition = 'transition-colors duration-theme';

  const MilestoneItem = ({ title, status, description, date, completed }) => (
    <div className="relative pl-12">
      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${transition}
        ${completed 
          ? darkMode ? 'bg-success-dark' : 'bg-success-light'
          : darkMode ? bgTertiary : 'bg-primary-200'}`}
      >
        <svg className={`w-4 h-4 ${transition}
          ${completed
            ? 'text-white'
            : darkMode ? textSecondary : 'text-primary-500'}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          {completed ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          )}
        </svg>
      </div>
      <div className="card">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-semibold ${transition} ${textPrimary}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 text-sm rounded ${transition}
            ${status === 'Completed'
              ? darkMode 
                ? 'bg-success-dark/20 text-success-dark' 
                : 'bg-success-light/20 text-success-light'
              : darkMode
                ? 'bg-warning-dark/20 text-warning-dark'
                : 'bg-warning-light/20 text-warning-light'}`}
          >
            {status}
          </span>
        </div>
        <p className={`mb-2 ${transition} ${textSecondary}`}>
          {description}
        </p>
        <p className={`text-sm ${transition} ${textSecondary}`}>
          {completed ? 'Completed on' : 'Due by'} {date}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${transition} ${textPrimary}`}>
          Milestones
        </h1>
        <button className={`px-4 py-2 rounded-md ${transition}
          ${darkMode 
            ? 'bg-info-dark hover:bg-info-light text-dark-text-primary' 
            : 'text-white bg-info-light hover:bg-info-dark'}`}
        >
          Create Milestone
        </button>
      </div>

      <div className="space-y-6">
        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${transition} ${bgTertiary}`}></div>

          {/* Milestone Items */}
          <div className="space-y-8">
            <MilestoneItem
              title="Complete Basic React Tutorials"
              status="Completed"
              description="Finished fundamental React concepts including components, props, and state."
              date="January 15, 2024"
              completed={true}
            />

            <MilestoneItem
              title="Build First React Project"
              status="In Progress"
              description="Create a complete web application using React and modern best practices."
              date="February 28, 2024"
              completed={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestones;
