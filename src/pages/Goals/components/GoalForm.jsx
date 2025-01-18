import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const GoalForm = ({
  formData,
  formErrors,
  onSubmit,
  onChange,
  onCancel,
  isEditing,
}) => {
  const { darkMode } = useTheme();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          className={`block mb-1 ${
            darkMode ? "text-dark-text-primary" : "text-gray-700"
          }`}
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            darkMode
              ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
              : "bg-white border-gray-300"
          }`}
        />
        {formErrors.title && (
          <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>
        )}
      </div>

      <div>
        <label
          className={`block mb-1 ${
            darkMode ? "text-dark-text-primary" : "text-gray-700"
          }`}
        >
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className={`w-full p-2 border rounded ${
            darkMode
              ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
              : "bg-white border-gray-300"
          }`}
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className={`block mb-1 ${
              darkMode ? "text-dark-text-primary" : "text-gray-700"
            }`}
          >
            Start Date
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={onChange}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
                : "bg-white border-gray-300"
            }`}
          />
          {formErrors.start_date && (
            <p className="mt-1 text-sm text-red-500">{formErrors.start_date}</p>
          )}
        </div>

        <div>
          <label
            className={`block mb-1 ${
              darkMode ? "text-dark-text-primary" : "text-gray-700"
            }`}
          >
            End Date
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={onChange}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
                : "bg-white border-gray-300"
            }`}
          />
          {formErrors.end_date && (
            <p className="mt-1 text-sm text-red-500">{formErrors.end_date}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className={`block mb-1 ${
              darkMode ? "text-dark-text-primary" : "text-gray-700"
            }`}
          >
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={onChange}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            className={`block mb-1 ${
              darkMode ? "text-dark-text-primary" : "text-gray-700"
            }`}
          >
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className={`w-full p-2 border rounded ${
              darkMode
                ? "border-gray-600 bg-dark-bg-secondary text-dark-text-primary"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isEditing ? "Update" : "Create"} Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
