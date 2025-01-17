import React from 'react';
import { logger } from '../../utils/logger';
import { useTheme } from '../../contexts/ThemeContext';

const Progress = () => {
  logger.debug('Rendering Progress page');
  const { darkMode } = useTheme();

  const textPrimary = darkMode ? 'text-dark-text-primary' : 'text-primary-900';
  const textSecondary = darkMode ? 'text-dark-text-secondary' : 'text-primary-600';
  const bgTertiary = darkMode ? 'bg-dark-bg-tertiary' : 'bg-primary-100';
  const transition = 'transition-colors duration-theme';

  const SummaryCard = ({ title, value, change, color }) => (
    <div className={`card ${transition}`}>
      <h3 className={`text-sm font-medium ${transition} ${textSecondary}`}>
        {title}
      </h3>
      <p className={`mt-2 text-2xl font-bold ${transition} ${darkMode ? `text-${color}-dark` : `text-${color}-light`}`}>
        {value}
      </p>
      <div className="flex items-center mt-2">
        {change ? (
          <>
            <span className={`text-sm ${transition} ${darkMode ? 'text-success-dark' : 'text-success-light'}`}>
              ↑ {change}
            </span>
            <span className={`ml-2 text-sm ${transition} ${textSecondary}`}>
              vs last month
            </span>
          </>
        ) : (
          <span className={`text-sm ${transition} ${textSecondary}`}>
            No change
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className={`mb-6 text-2xl font-bold ${transition} ${textPrimary}`}>
        Progress Overview
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total Goals"
          value="5"
          change="2"
          color="info"
        />
        <SummaryCard 
          title="Completed Tasks"
          value="12"
          change="5"
          color="success"
        />
        <SummaryCard 
          title="Active Milestones"
          value="3"
          color="info"
        />
        <SummaryCard 
          title="Achievement Rate"
          value="85%"
          change="10%"
          color="accent"
        />
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Goal Progress */}
        <div className="card">
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Goal Progress
          </h2>
          <div className="space-y-4">
            {['Learn React', 'Master TypeScript', 'Build Portfolio'].map((goal, index) => (
              <div key={goal}>
                <div className={`flex justify-between mb-1 text-sm ${transition} ${textSecondary}`}>
                  <span>{goal}</span>
                  <span>{[45, 30, 60][index]}%</span>
                </div>
                <div className={`w-full h-2.5 rounded-full ${transition} ${bgTertiary}`}>
                  <div className={`h-2.5 rounded-full ${transition} ${darkMode ? 'bg-info-dark' : 'bg-info-light'}`}
                    style={{ width: `${[45, 30, 60][index]}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card">
          <h2 className={`mb-4 text-lg font-semibold ${transition} ${textPrimary}`}>
            Weekly Activity
          </h2>
          <div className="flex justify-between items-end h-48">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <div key={day} className="flex flex-col items-center">
                <div className={`w-8 rounded-t ${transition} 
                  ${darkMode ? `bg-info-dark/${[30, 50, 80, 60, 40, 20, 35][index]}` : `bg-info-light/${[30, 50, 80, 60, 40, 20, 35][index]}`}`}
                  style={{ height: `${[30, 50, 80, 60, 40, 20, 35][index]}%` }}
                ></div>
                <span className={`mt-2 text-xs ${transition} ${textSecondary}`}>
                  {day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
