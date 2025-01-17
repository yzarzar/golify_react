import React, { useEffect, useState } from "react";
import { logger } from "../../utils/logger";
import { useTheme } from "../../contexts/ThemeContext";
import { goalApi } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import GoalCard from "./components/GoalCard";
import GoalModal from "./components/GoalModal";
import CreateGoalForm from "./components/CreateGoalForm";
import SearchBar from "./components/SearchBar";
import AddGoalCard from "./components/AddGoalCard";
import GoalCardSkeleton from "./components/GoalCardSkeleton";

const Goals = () => {
  logger.debug("Rendering Goals page");
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority: "medium"
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const response = await goalApi.getGoals();
        if (response.success) {
          console.log("Goals data:", response.data.goals);
          setGoals(response.data.goals);
        } else {
          setError("Failed to fetch goals");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch goals");
        logger.error("Error fetching goals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, []);

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "in-progress" && goal.status === "in_progress") ||
      (activeTab === "pending" && goal.status === "pending") ||
      (activeTab === "complete" && goal.status === "completed");
    return matchesSearch && matchesTab;
  });

  const getStatusStyle = (status) => {
    const baseClasses =
      "px-2 py-1 text-sm rounded transition-colors duration-theme ";
    switch (status) {
      case "completed":
        return (
          baseClasses +
          (darkMode
            ? "bg-success-dark/20 text-success-dark"
            : "bg-success-light/20 text-success-light")
        );
      case "in_progress":
        return (
          baseClasses +
          (darkMode
            ? "bg-info-dark/20 text-info-dark"
            : "bg-info-light/20 text-info-light")
        );
      default:
        return (
          baseClasses +
          (darkMode
            ? "bg-gray-600/20 text-gray-300"
            : "bg-gray-200 text-gray-600")
        );
    }
  };

  const TabButton = ({ id, label, count }) => {
    const getTabIcon = () => {
      switch (id) {
        case 'all':
          return (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          );
        case 'pending':
          return (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'in-progress':
          return (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          );
        case 'complete':
          return (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5 13l4 4L19 7" />
            </svg>
          );
        default:
          return null;
      }
    };

    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative px-4 py-2 rounded-md transition-all duration-200 inline-flex items-center gap-2
          ${
            activeTab === id
              ? darkMode
                ? "bg-info-dark/10 text-white font-medium"
                : "bg-info-light/5 text-info-light font-medium"
              : darkMode
              ? "text-dark-text-secondary hover:bg-dark-bg-secondary"
              : "text-primary-600 hover:bg-gray-100"
          }
          ${
            activeTab === id
              ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-current"
              : ""
          }`}
      >
        {getTabIcon()}
        <span>{label}</span>
        {count !== undefined && (
          <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${
            activeTab === id
              ? darkMode
                ? "bg-info-dark/20"
                : "bg-info-light/20"
              : darkMode
              ? "bg-dark-bg-secondary"
              : "bg-gray-100"
          }`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      const response = await goalApi.createGoal({
        ...formData,
        user_id: user.id
      });

      if (response.success) {
        // Properly update the goals state with the new goal
        setGoals(prevGoals => [...prevGoals, {
          ...response.data,
          progress_percentage: 0, // Ensure progress starts at 0
          status: 'pending' // Ensure initial status is pending
        }]);
        
        setShowCreateForm(false);
        setFormData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          priority: "medium"
        });
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setFormErrors(error.response.data.errors);
      }
      logger.error("Failed to create goal:", error);
    }
  };

  const handleGoalUpdate = (updatedGoal) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal)
    );
  };

  const handleGoalDelete = (goalId) => {
    // Update goals list
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
    
    // Close modal if the deleted goal was selected
    if (selectedGoal && selectedGoal.id === goalId) {
      setSelectedGoal(null);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div
            className={`h-8 w-32 rounded-lg animate-pulse
              ${darkMode ? "bg-dark-bg-tertiary" : "bg-gray-200"}`}
          />
          <div
            className={`h-10 w-28 rounded-md animate-pulse
              ${darkMode ? "bg-dark-bg-tertiary" : "bg-gray-200"}`}
          />
        </div>

        <div className="mb-6">
          <div
            className={`h-12 w-full rounded-lg animate-pulse border
              ${
                darkMode
                  ? "bg-dark-bg-tertiary border-dark-border"
                  : "bg-gray-200 border-gray-200"
              }`}
          />
        </div>

        <div className="flex overflow-x-auto mb-6 space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-10 w-24 rounded-md animate-pulse
                ${darkMode ? "bg-dark-bg-tertiary" : "bg-gray-200"}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <GoalCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <GoalModal
        goal={selectedGoal}
        onClose={() => setSelectedGoal(null)}
        getStatusStyle={getStatusStyle}
        onUpdate={handleGoalUpdate}
      />

      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-2xl font-bold transition-colors duration-theme
          ${darkMode ? "text-dark-text-primary" : "text-primary-900"}`}
        >
          My Goals
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
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

      {showCreateForm && (
        <CreateGoalForm
          formData={formData}
          formErrors={formErrors}
          onSubmit={handleCreateGoal}
          onChange={handleInputChange}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      <div className="mb-6">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex overflow-x-auto mb-6 space-x-2">
        <TabButton id="all" label="All" count={goals.length} />
        <TabButton
          id="pending"
          label="Pending"
          count={goals.filter((g) => g.status === "pending").length}
        />
        <TabButton
          id="in-progress"
          label="In Progress"
          count={goals.filter((g) => g.status === "in_progress").length}
        />
        <TabButton
          id="complete"
          label="Complete"
          count={goals.filter((g) => g.status === "completed").length}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <GoalCardSkeleton key={i} />)
        ) : (
          <>
            <AddGoalCard onClick={() => setShowCreateForm(true)} />
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onClick={() => setSelectedGoal(goal)}
                getStatusStyle={getStatusStyle}
                onDelete={handleGoalDelete}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Goals;
