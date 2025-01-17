import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { logger } from '../utils/logger';

const Sidebar = ({ isSidebarCollapsed }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  logger.debug('Rendering Sidebar');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    logger.debug(`Dropdown menu ${isDropdownOpen ? 'closed' : 'opened'}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      logger.debug('User logged out and redirected to login page');
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => {
    const baseClasses = "flex items-center p-2 space-x-2 rounded-md transition-all duration-200";
    const activeClasses = darkMode
      ? "bg-info-dark text-white font-medium"
      : "bg-info-light/10 text-info-light font-medium";
    const inactiveClasses = darkMode
      ? "text-gray-300 hover:bg-gray-700 hover:text-white"
      : "text-gray-800 hover:bg-gray-200";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  const headerClasses = `px-2 text-xs font-semibold tracking-wider uppercase mb-2
    ${darkMode ? 'text-gray-400' : 'text-gray-600'}`;

  return (
    <aside
      className={`shadow-lg transition-all duration-300 ease-in-out flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)]
        ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}
        ${isSidebarCollapsed ? 'w-0' : 'w-64'}
      `}
    >
      <nav className={`flex flex-col h-full ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
        {/* Navigation Links */}
        <div className="flex-1 p-4 space-y-6">
          {/* Overview Section */}
          <div>
            <Link to="/dashboard" className={getLinkClasses('/dashboard')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Goals Section */}
          <div>
            <h3 className={headerClasses}>Goals</h3>
            <Link to="/goals" className={getLinkClasses('/goals')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>All Goals</span>
            </Link>
          </div>

          {/* Milestones Section */}
          <div>
            <h3 className={headerClasses}>Milestones</h3>
            <Link to="/milestones" className={getLinkClasses('/milestones')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
              <span>View Milestones</span>
            </Link>
          </div>

          {/* Tasks Section */}
          <div>
            <h3 className={headerClasses}>Tasks</h3>
            <Link to="/tasks" className={getLinkClasses('/tasks')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Tasks</span>
            </Link>
          </div>

          {/* Progress Section */}
          <div>
            <h3 className={headerClasses}>Progress</h3>
            <Link to="/achievements" className={getLinkClasses('/achievements')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Achievements</span>
            </Link>
            <Link to="/progress" className={getLinkClasses('/progress')}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>View Progress</span>
            </Link>
          </div>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleAvatarClick}
              className={`flex items-center w-full p-2 space-x-2 rounded-md transition-colors duration-200
                ${darkMode 
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-800'
                }`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={`absolute bottom-full left-0 w-full mb-2 rounded-md shadow-lg 
                ${darkMode ? 'bg-gray-700' : 'bg-white'} 
                border ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}
              >
                <button
                  onClick={handleLogout}
                  className={`w-full text-left px-4 py-2 text-sm rounded-md
                    ${darkMode 
                      ? 'text-gray-300 hover:bg-gray-600 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  isSidebarCollapsed: PropTypes.bool.isRequired,
};

export default Sidebar;
