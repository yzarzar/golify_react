import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { goalApi } from "../../../services/api";
import ConfirmDialog from "./ConfirmDialog";

const getPriorityStyle = (priority, darkMode) => {
  const baseClasses = "text-xs font-medium px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ";
  const dotClass = "w-1.5 h-1.5 rounded-full";
  
  switch (priority) {
    case "high":
      return {
        container: baseClasses + (darkMode
          ? "bg-error-dark/10 text-error-dark"
          : "bg-error-light/10 text-error-light"),
        dot: `${dotClass} ${darkMode ? "bg-error-dark" : "bg-error-light"}`
      };
    case "medium":
      return {
        container: baseClasses + (darkMode
          ? "bg-warning-dark/10 text-warning-dark"
          : "bg-warning-light/10 text-warning-light"),
        dot: `${dotClass} ${darkMode ? "bg-warning-dark" : "bg-warning-light"}`
      };
    default:
      return {
        container: baseClasses + (darkMode
          ? "bg-success-dark/10 text-success-dark"
          : "bg-success-light/10 text-success-light"),
        dot: `${dotClass} ${darkMode ? "bg-success-dark" : "bg-success-light"}`
      };
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const GoalCard = ({ goal, onClick, getStatusStyle, onDelete }) => {
  const { darkMode } = useTheme();
  const priorityStyle = getPriorityStyle(goal.priority, darkMode);
  const progress = goal.progress_percentage;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await goalApi.deleteGoal(goal.id);
      setShowDeleteConfirm(false);
      if (onDelete) {
        onDelete(goal.id);
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case "in_progress":
        return (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group p-6 rounded-xl transition-all duration-300 hover:shadow-lg min-h-[280px] max-w-full flex flex-col cursor-pointer relative overflow-hidden transform hover:-translate-y-1
          ${
            darkMode
              ? "border bg-dark-bg-secondary border-dark-border hover:bg-dark-bg-primary"
              : "bg-white border border-gray-100 hover:bg-gray-50"
          }`}
      >
        {/* Progress Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${darkMode ? "bg-dark-bg-primary" : "bg-gray-100"}`}>
          <div
            className={`h-full transition-all duration-500 ease-out ${
              goal.status === "completed"
                ? darkMode ? "bg-success-dark" : "bg-success-light"
                : darkMode ? "bg-info-dark" : "bg-info-light"
            }`}
            style={{ 
              width: `${isHovered ? (goal.status === "completed" ? 100 : progress) : 0}%`,
              transitionDelay: '150ms'
            }}
          />
        </div>

        <div className="flex flex-col flex-1">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`font-semibold text-lg mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {goal.title}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={priorityStyle.container}>
                  <span className={priorityStyle.dot}></span>
                  {goal.priority}
                </span>
                <button
                  onClick={handleDelete}
                  className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    ${darkMode 
                      ? "hover:bg-error-dark/20 text-error-dark" 
                      : "hover:bg-error-light/20 text-error-light"}`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {goal.description}
            </p>
          </div>

          {/* Status and Progress Section */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center gap-2 ${getStatusStyle(goal.status)}`}>
                {getStatusIcon(goal.status)}
                <span className="capitalize">{goal.status.replace('_', ' ')}</span>
              </div>
              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Timeline Section */}
            <div className={`flex items-center justify-between text-xs mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(goal.start_date)}</span>
              </div>
              <span>→</span>
              <div className="flex items-center gap-1">
                <span>{formatDate(goal.end_date)}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message="Are you sure you want to delete this goal? This action cannot be undone."
        confirmText="Delete"
        confirmLoading={isDeleting}
      />
    </>
  );
};

export default GoalCard;