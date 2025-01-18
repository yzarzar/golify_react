import React, { useState, useEffect } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import EditGoalForm from "./EditGoalForm";
import { useNavigate } from "react-router-dom";

const getPriorityStyle = (priority, darkMode) => {
  const baseClasses = "px-2 py-1 text-sm rounded-full ";
  switch (priority) {
    case "high":
      return (
        baseClasses +
        (darkMode
          ? "bg-error-dark/20 text-error-dark"
          : "bg-error-light/20 text-error-light")
      );
    case "medium":
      return (
        baseClasses +
        (darkMode
          ? "bg-warning-dark/20 text-warning-dark"
          : "bg-warning-light/20 text-warning-light")
      );
    default:
      return (
        baseClasses +
        (darkMode
          ? "bg-success-dark/20 text-success-dark"
          : "bg-success-light/20 text-success-light")
      );
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

const InfoRow = ({ label, value, className = "", darkMode }) => (
  <div
    className={`flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 ${className}`}
  >
    <span
      className={`text-sm font-medium ${
        darkMode ? "text-dark-text-secondary" : "text-gray-500"
      }`}
    >
      {label}
    </span>
    <span className={darkMode ? "text-dark-text-primary" : "text-gray-700"}>
      {value}
    </span>
  </div>
);

const GoalModal = ({ goal, onClose, getStatusStyle, onUpdate }) => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(goal);

  useEffect(() => {
    setCurrentGoal(goal);
  }, [goal]);

  if (!currentGoal) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleUpdate = (updatedGoal) => {
    setCurrentGoal(updatedGoal);
    if (onUpdate) onUpdate(updatedGoal);
    setIsEditing(false);
  };

  return (
    <div className="overflow-y-auto fixed inset-0 z-50">
      <div className="flex justify-center items-center px-4 pt-4 pb-20 min-h-screen text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={isEditing ? undefined : onClose}
        ></div>

        <div
          className={`relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform rounded-lg shadow-xl
            ${
              darkMode
                ? "border bg-dark-bg-primary border-dark-border"
                : "bg-white"
            }`}
        >
          {isEditing ? (
            <EditGoalForm
              goal={currentGoal}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
              darkMode={darkMode}
            />
          ) : (
            <>
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <h3
                    className={`text-2xl font-bold leading-6
                      ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}
                  >
                    {currentGoal.title}
                  </h3>
                  <button
                    onClick={onClose}
                    className={`rounded-full p-2 transition-colors duration-theme
                      ${
                        darkMode
                          ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={getPriorityStyle(currentGoal.priority, darkMode)}>
                    {currentGoal.priority.charAt(0).toUpperCase() +
                      currentGoal.priority.slice(1)}{" "}
                    Priority
                  </span>
                  <span className={getStatusStyle(currentGoal.status)}>
                    {currentGoal.status
                      .split("-")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </span>
                </div>

                <p
                  className={`text-base mb-6
                    ${darkMode ? "text-dark-text-secondary" : "text-gray-600"}`}
                >
                  {currentGoal.description}
                </p>

                {/* Timeline Section */}
                <div className={`rounded-lg mb-6 overflow-hidden ${darkMode ? "bg-dark-bg-secondary" : "bg-gray-50"}`}>
                  <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                    <h4 className={`text-base font-semibold ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                      Timeline & Progress
                    </h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex gap-3 items-center">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-dark-bg-primary" : "bg-white"}`}>
                            <svg className="w-5 h-5 text-info-light dark:text-info-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className={`text-xs font-medium mb-1 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                              Start Date
                            </div>
                            <div className={`text-sm ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                              {formatDateTime(currentGoal.start_date)}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 items-center">
                          <div className={`p-2 rounded-lg ${darkMode ? "bg-dark-bg-primary" : "bg-white"}`}>
                            <svg className="w-5 h-5 text-info-light dark:text-info-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className={`text-xs font-medium mb-1 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                              End Date
                            </div>
                            <div className={`text-sm ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                              {formatDateTime(currentGoal.end_date)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className={`text-xs font-medium ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                          Progress
                        </div>
                        <div className="flex gap-3 items-center">
                          <div className="flex-1">
                            <div className={`w-full h-3 rounded-full overflow-hidden ${darkMode ? "bg-dark-bg-primary" : "bg-gray-200"}`}>
                              <div
                                className={`h-full rounded-full transition-all duration-300 relative
                                  ${darkMode ? "bg-info-dark" : "bg-info-light"}`}
                                style={{ width: `${currentGoal.progress || 40}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20"></div>
                              </div>
                            </div>
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                            {currentGoal.progress || 40}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className={`rounded-lg overflow-hidden ${darkMode ? "bg-dark-bg-secondary" : "bg-gray-50"}`}>
                  <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                    <h4 className={`text-base font-semibold ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                      Additional Details
                    </h4>
                  </div>
                  
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <div className={`text-xs font-medium mb-1.5 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                            Status
                          </div>
                          <span className={`${getStatusStyle(currentGoal.status)} inline-flex items-center`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              currentGoal.status === "completed" 
                                ? "bg-success-light dark:bg-success-dark" 
                                : currentGoal.status === "in progress"
                                ? "bg-info-light dark:bg-info-dark"
                                : "bg-gray-400 dark:bg-gray-500"
                            }`}></span>
                            {currentGoal.status}
                          </span>
                        </div>

                        <div>
                          <div className={`text-xs font-medium mb-1.5 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                            Priority
                          </div>
                          <span className={getPriorityStyle(currentGoal.priority, darkMode)}>
                            {currentGoal.priority.charAt(0).toUpperCase() + currentGoal.priority.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className={`text-xs font-medium mb-1.5 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                            Created
                          </div>
                          <div className={`text-sm ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                            {formatDateTime(currentGoal.created_at)}
                          </div>
                        </div>

                        <div>
                          <div className={`text-xs font-medium mb-1.5 ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`}>
                            Updated
                          </div>
                          <div className={`text-sm ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
                            {formatDateTime(currentGoal.updated_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-md transition-colors duration-theme
                    ${
                      darkMode
                        ? "text-dark-text-primary bg-dark-bg-secondary hover:bg-dark-bg-tertiary"
                        : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                    }`}
                >
                  Close
                </button>
                <button
                  onClick={() => navigate('/goal-hub')}
                  className={`px-4 py-2 flex items-center gap-2 rounded-md transition-colors duration-theme
                    ${darkMode ? "text-white bg-info-dark hover:bg-info-dark/90" : "text-white bg-info-light hover:bg-info-light/90"}`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Go to Goal Hub</span>
                </button>
                <button
                  onClick={handleEdit}
                  className={`px-4 py-2 rounded-md transition-colors duration-theme
                    ${
                      darkMode
                        ? "text-white bg-info-dark hover:bg-info-dark/90"
                        : "text-white bg-info-light hover:bg-info-light/90"
                    }`}
                >
                  Edit Goal
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
