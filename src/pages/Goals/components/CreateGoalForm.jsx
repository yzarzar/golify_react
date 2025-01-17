import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const CreateGoalForm = ({
  formData,
  formErrors,
  onSubmit,
  onChange,
  onClose,
}) => {
  const { darkMode } = useTheme();

  return (
    <div className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/50">
      <div
        className={`w-full max-w-2xl rounded-lg shadow-lg p-6 transition-colors duration-theme
        ${darkMode ? "bg-dark-bg-secondary" : "bg-white"}`}
      >
        <h2
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-dark-text-primary" : "text-primary-900"
          }`}
        >
          Create New Goal
        </h2>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label
                className={`block mb-1 ${
                  darkMode ? "text-dark-text-secondary" : "text-primary-700"
                }`}
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? "bg-dark-bg-primary border-dark-border text-dark-text-primary"
                    : "bg-white border-gray-300 text-primary-900"
                }`}
                required
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-error-light">
                  {formErrors.title[0]}
                </p>
              )}
            </div>
            <div>
              <label
                className={`block mb-1 ${
                  darkMode ? "text-dark-text-secondary" : "text-primary-700"
                }`}
              >
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? "bg-dark-bg-primary border-dark-border text-dark-text-primary"
                    : "bg-white border-gray-300 text-primary-900"
                }`}
                rows="4"
                required
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-error-light">
                  {formErrors.description[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className={`block mb-1 ${
                    darkMode ? "text-dark-text-secondary" : "text-primary-700"
                  }`}
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={onChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-dark-bg-primary border-dark-border text-dark-text-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                      : "bg-white border-gray-300 text-primary-900"
                  }`}
                  required
                />
                {formErrors.start_date && (
                  <p className="mt-1 text-sm text-error-light">
                    {formErrors.start_date[0]}
                  </p>
                )}
              </div>
              <div>
                <label
                  className={`block mb-1 ${
                    darkMode ? "text-dark-text-secondary" : "text-primary-700"
                  }`}
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={onChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-dark-bg-primary border-dark-border text-dark-text-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                      : "bg-white border-gray-300 text-primary-900"
                  }`}
                  required
                />
                {formErrors.end_date && (
                  <p className="mt-1 text-sm text-error-light">
                    {formErrors.end_date[0]}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className={`block mb-1 ${
                  darkMode ? "text-dark-text-secondary" : "text-primary-700"
                }`}
              >
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={onChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  darkMode
                    ? "bg-dark-bg-primary border-dark-border text-dark-text-primary"
                    : "bg-white border-gray-300 text-primary-900"
                }`}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {formErrors.priority && (
                <p className="mt-1 text-sm text-error-light">
                  {formErrors.priority[0]}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md transition-all duration-200
                ${
                  darkMode
                    ? "bg-dark-bg-primary text-dark-text-secondary hover:bg-dark-bg-secondary"
                    : "bg-gray-100 text-primary-600 hover:bg-gray-200"
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md transition-all duration-200
                ${
                  darkMode
                    ? "text-white bg-info-dark hover:bg-info-dark/90"
                    : "text-white bg-info-light hover:bg-info-light/90"
                }`}
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGoalForm;
