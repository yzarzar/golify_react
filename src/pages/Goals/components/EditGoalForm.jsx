import React, { useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { goalApi } from "../../../services/api";
import { toast } from "react-hot-toast";
import {
  Title as TitleIcon,
  Description as DescriptionIcon,
  CalendarMonth as CalendarIcon,
  Flag as FlagIcon,
  EmojiEvents as TrophyIcon,
  Edit as EditIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

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
      {/* Header with Trophy Icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-full ${darkMode ? 'bg-info-dark/10' : 'bg-info-light/10'}`}>
          <TrophyIcon className={`text-2xl ${darkMode ? 'text-info-dark' : 'text-info-light'}`} />
        </div>
        <div>
          <h3 className={`text-lg font-semibold ${darkMode ? "text-dark-text-primary" : "text-gray-900"}`}>
            Refine Your Goal
          </h3>
          <p className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-600"}`}>
            Great goals evolve. Make your adjustments count!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TitleIcon className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`} />
            <label className={labelClasses}>Title</label>
          </div>
          <input
            type="text"
            name="title"
            value={editedGoal.title}
            onChange={handleChange}
            className={`${inputClasses} ${
              errors.title ? "border-error-light dark:border-error-dark" : ""
            }`}
            placeholder="What would you like to achieve?"
          />
          {errors.title && <p className={errorClasses}>{errors.title}</p>}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <DescriptionIcon className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`} />
            <label className={labelClasses}>Description</label>
          </div>
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
            placeholder="Break down your goal into clear, actionable steps..."
          />
          {errors.description && (
            <p className={errorClasses}>{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`} />
              <label className={labelClasses}>Start Date</label>
            </div>
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
            <div className="flex items-center gap-2 mb-1">
              <CalendarIcon className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`} />
              <label className={labelClasses}>End Date</label>
            </div>
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
          <div className="flex items-center gap-2 mb-1">
            <FlagIcon className={`text-sm ${darkMode ? "text-dark-text-secondary" : "text-gray-500"}`} />
            <label className={labelClasses}>Priority</label>
          </div>
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
            <option value="">How important is this goal?</option>
            <option value="low">Low - Keep it on the radar</option>
            <option value="medium">Medium - Important milestone ahead</option>
            <option value="high">High - Top priority focus</option>
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
          className={`px-4 py-2 rounded-md transition-colors duration-theme
            ${darkMode
              ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
              : "text-gray-500 hover:bg-gray-100"
            }`}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white transition-colors duration-theme
            ${darkMode
              ? "bg-info-dark hover:bg-info-dark/90"
              : "bg-info-light hover:bg-info-light/90"
            }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Goal"}
        </button>
      </div>
    </form>
  );
};

export default EditGoalForm;
