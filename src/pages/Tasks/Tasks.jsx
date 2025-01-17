import React from 'react';
import { logger } from '../../utils/logger';
import { useTheme } from '../../contexts/ThemeContext';

const Tasks = () => {
  logger.debug('Rendering Tasks page');
  const { darkMode } = useTheme();

  const textPrimary = darkMode ? 'text-dark-text-primary' : 'text-primary-900';
  const textSecondary = darkMode ? 'text-dark-text-secondary' : 'text-primary-600';
  const transition = 'transition-colors duration-theme';

  const TaskCard = ({ title, description, tag, tagColor, dueDate, completed }) => (
    <div className={`card ${completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <input 
            type="checkbox" 
            checked={completed}
            className={`mt-1 ${transition} 
              ${darkMode ? 'accent-info-dark' : 'accent-info-light'}`}
          />
          <div>
            <h3 className={`font-medium ${transition} ${textPrimary} ${completed ? 'line-through' : ''}`}>
              {title}
            </h3>
            <p className={`text-sm mt-1 ${transition} ${textSecondary}`}>
              {description}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded ${transition}
                ${darkMode 
                  ? `bg-${tagColor}-dark/20 text-${tagColor}-dark` 
                  : `bg-${tagColor}-light/20 text-${tagColor}-light`}`}
              >
                {tag}
              </span>
              <span className={`text-xs ${transition} ${textSecondary}`}>
                {completed ? 'Completed' : `Due: ${dueDate}`}
              </span>
            </div>
          </div>
        </div>
        <button className={`${transition} ${textSecondary} hover:${textPrimary}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-bold ${transition} ${textPrimary}`}>
          My Tasks
        </h1>
        <button className={`px-4 py-2 rounded-md ${transition}
          ${darkMode 
            ? 'bg-info-dark hover:bg-info-light text-dark-text-primary' 
            : 'text-white bg-info-light hover:bg-info-dark'}`}
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="space-y-4">
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            To Do
          </h2>
          <div className="space-y-4">
            <TaskCard
              title="Study React Hooks"
              description="Learn useEffect and custom hooks"
              tag="React"
              tagColor="info"
              dueDate="Tomorrow"
              completed={false}
            />
          </div>
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            In Progress
          </h2>
          <div className="space-y-4">
            <TaskCard
              title="Build Todo App"
              description="Create a simple todo app using React"
              tag="Project"
              tagColor="accent"
              dueDate="Next Week"
              completed={false}
            />
          </div>
        </div>

        {/* Completed Column */}
        <div className="space-y-4">
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Completed
          </h2>
          <div className="space-y-4">
            <TaskCard
              title="Setup Development Environment"
              description="Install Node.js and create React app"
              tag="Setup"
              tagColor="success"
              dueDate="Yesterday"
              completed={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
