import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { goalApi } from "../../../services/api";
import { toast } from "react-hot-toast";

const EditGoalForm = ({ goal, onUpdate, onCancel }) => {
  const { darkMode } = useTheme();
  const [editedGoal, setEditedGoal] = useState({
    ...goal,
    start_date: goal.start_date
      ? new Date(goal.start_date).toISOString().slice(0, 10)
      : "",
    end_date: goal.end_date
      ? new Date(goal.end_date).toISOString().slice(0, 10)
      : "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editedGoal.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!editedGoal.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!editedGoal.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!editedGoal.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (!editedGoal.priority) {
      newErrors.priority = "Priority is required";
    }
    if (
      editedGoal.start_date &&
      editedGoal.end_date &&
      new Date(editedGoal.start_date) > new Date(editedGoal.end_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await goalApi.updateGoal(goal.id, {
        title: editedGoal.title,
        description: editedGoal.description,
        start_date: editedGoal.start_date,
        end_date: editedGoal.end_date,
        priority: editedGoal.priority,
      });

      if (response.success) {
        toast.success("Goal updated successfully");
        onUpdate(response.data);
      } else {
        toast.error(response.message || "Failed to update goal");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update goal");
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full px-3 py-2 rounded-md border transition-colors duration-theme
    ${
      darkMode
        ? "bg-dark-bg-secondary text-dark-text-primary border-dark-border focus:border-info-dark"
        : "bg-white text-gray-900 border-gray-300 focus:border-info-light"
    } focus:ring-0 focus:outline-none`;

  const labelClasses = `block text-sm font-medium mb-1
    ${darkMode ? "text-dark-text-secondary" : "text-gray-700"}`;

  const errorClasses = "mt-1 text-sm text-error-light dark:text-error-dark";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className={labelClasses}>Title</label>
          <input
            type="text"
            name="title"
            value={editedGoal.title}
            onChange={handleChange}
            className={`${inputClasses} ${
              errors.title ? "border-error-light dark:border-error-dark" : ""
            }`}
            placeholder="Enter goal title"
          />
          {errors.title && <p className={errorClasses}>{errors.title}</p>}
        </div>

        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            name="description"
            value={editedGoal.description}
            onChange={handleChange}
            rows="4"
            className={`${inputClasses} resize-none ${
              errors.description
                ? "border-error-light dark:border-error-dark"
                : ""
            }`}
            placeholder="Enter goal description"
          />
          {errors.description && (
            <p className={errorClasses}>{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={editedGoal.start_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                darkMode
                  ? "bg-dark-bg-primary border-dark-border text-dark-text-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                  : "bg-white border-gray-300 text-primary-900"
              }`}
              required
            />
            {errors.start_date && (
              <p className={errorClasses}>{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>End Date</label>
            <input
              type="date"
              name="end_date"
              value={editedGoal.end_date}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                darkMode
                  ? "bg-dark-bg-primary border-dark-border text-dark-text-primary [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70"
                  : "bg-white border-gray-300 text-primary-900"
              }`}
              required
            />
            {errors.end_date && (
              <p className={errorClasses}>{errors.end_date}</p>
            )}
          </div>
        </div>

        <div>
          <label className={labelClasses}>Priority</label>
          <select
            name="priority"
            value={editedGoal.priority}
            onChange={handleChange}
            className={`${inputClasses} ${
              errors.priority
                ? "border-error-light dark:border-error-dark"
                : ""
            }`}
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className={errorClasses}>{errors.priority}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-gray-200 dark:border-dark-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md transition-all duration-200
            ${
              darkMode
                ? "text-dark-text-primary bg-dark-bg-secondary hover:bg-dark-bg-tertiary"
                : "text-gray-700 bg-gray-100 hover:bg-gray-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md transition-all duration-200
            ${
              darkMode
                ? "bg-info-dark hover:bg-info-dark/90"
                : "bg-info-light hover:bg-info-light/90"
            } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="mr-2 -ml-1 w-4 h-4 text-white animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </form>
  );
};

export default EditGoalForm;
