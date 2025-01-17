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
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = (e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`group p-6 rounded-xl transition-all duration-300 hover:shadow-lg min-h-[280px] max-w-full flex flex-col cursor-pointer relative overflow-hidden
          ${
            darkMode
              ? "border bg-dark-bg-secondary border-dark-border hover:bg-dark-bg-primary"
              : "bg-white border border-gray-100 hover:bg-gray-50"
          }`}
      >
        {/* Progress Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${darkMode ? "bg-dark-bg-primary" : "bg-gray-100"}`}>
          <div
            className={`h-full transition-all duration-300 ${
              goal.status === "completed"
                ? darkMode ? "bg-success-dark" : "bg-success-light"
                : darkMode ? "bg-info-dark" : "bg-info-light"
            }`}
            style={{ width: `${goal.status === "completed" ? 100 : progress}%` }}
          />
        </div>

        <div className="flex flex-col flex-1">
          {/* Header Section */}
          <div className="mb-4">
            <div className="flex gap-4 justify-between items-start">
              <h3
                className={`text-lg font-semibold transition-colors duration-theme line-clamp-2
                  ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}
                title={goal.title}
              >
                {goal.title}
              </h3>
              <div className="flex gap-2 items-center">
                <div className={`shrink-0 ${priorityStyle.container}`}>
                  <span className={priorityStyle.dot}></span>
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                </div>
                <button
                  onClick={handleDelete}
                  className={`p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    ${
                      darkMode
                        ? "hover:bg-error-dark/10 text-error-dark"
                        : "hover:bg-error-light/10 text-error-light"
                    }`}
                  aria-label="Delete goal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mt-2">
              <span className={`${getStatusStyle(goal.status)} inline-flex items-center gap-2`}>
                {/* Status Icons */}
                {goal.status === "completed" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : goal.status === "in_progress" ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {/* Status Text */}
                {goal.status
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p
            className={`mb-6 transition-colors duration-theme line-clamp-3
              ${darkMode ? "text-dark-text-secondary" : "text-gray-600"}`}
            title={goal.description}
          >
            {goal.description}
          </p>

          {/* Footer */}
          <div className="mt-auto space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className={`flex items-center gap-2 ${
                darkMode ? "text-dark-text-secondary" : "text-gray-500"
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(goal.start_date)}</span>
              </div>
              <div className={`flex items-center gap-2 ${
                darkMode ? "text-dark-text-secondary" : "text-gray-500"
              }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M5 13l4 4L19 7" />
                </svg>
                <span>{formatDate(goal.end_date)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goal.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
};

export default GoalCard;