import React from 'react';
import { logger } from '../../utils/logger';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = () => {
  logger.debug('Rendering Dashboard page');
  const { darkMode } = useTheme();

  const textPrimary = darkMode ? 'text-dark-text-primary' : 'text-primary-900';
  const textSecondary = darkMode ? 'text-dark-text-secondary' : 'text-primary-600';
  const transition = 'transition-colors duration-theme';

  const StatCard = ({ title, value, color }) => (
    <div>
      <p className={`text-sm ${transition} ${textSecondary}`}>
        {title}
      </p>
      <p className={`text-2xl font-bold ${transition} ${darkMode ? `text-${color}-dark` : `text-${color}-light`}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className={`mb-6 text-2xl font-bold ${transition} ${textPrimary}`}>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className={`p-6 rounded-lg shadow-sm transition-colors duration-theme
          ${darkMode ? 'border bg-dark-bg-secondary border-dark-border' : 'bg-white'}`}
        >
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Quick Stats
          </h2>
          <div className="space-y-4">
            <StatCard title="Active Goals" value="5" color="info" />
            <StatCard title="Completed Tasks" value="12" color="success" />
            <StatCard title="Achievements" value="3" color="warning" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-lg shadow-sm transition-colors duration-theme
          ${darkMode ? 'border bg-dark-bg-secondary border-dark-border' : 'bg-white'}`}
        >
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            <p className={`${transition} ${textSecondary}`}>
              Coming soon...
            </p>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className={`p-6 rounded-lg shadow-sm transition-colors duration-theme
          ${darkMode ? 'border bg-dark-bg-secondary border-dark-border' : 'bg-white'}`}
        >
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Upcoming Milestones
          </h2>
          <div className="space-y-4">
            <p className={`${transition} ${textSecondary}`}>
              Coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
