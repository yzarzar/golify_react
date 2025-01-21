import React, { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Container, 
  Fab, 
  Zoom,
  Typography,
  Stack,
  Tooltip,
  useTheme,
  Alert,
  Snackbar
} from "@mui/material";
import { 
  Add as AddIcon,
  EmojiObjects as EmojiObjectsIcon 
} from "@mui/icons-material";
import GoalHeader from "./components/GoalHeader";
import GridContainer from "./components/GridContainer";
import Milestone from "./components/Milestone";
import EmptyMilestoneState from "./components/EmptyMilestoneState";
import AddMilestoneButton from "./components/AddMilestoneButton";
import { useLocation } from "react-router-dom";
import { goalApi, milestoneApi } from "../../services/api";

const GoalHub = () => {
  const location = useLocation();
  const [currentGoal, setCurrentGoal] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const goalId = new URLSearchParams(location.search).get("goalId");
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneField, setEditingMilestoneField] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskField, setEditingTaskField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState(null);

  const handleError = (message) => {
    setError(message);
  };

  const handleCloseError = () => {
    setError(null);
  };

  useEffect(() => {
    const fetchGoalData = async () => {
      if (goalId) {
        try {
          const response = await goalApi.getGoal(goalId);
          setCurrentGoal(response.data);
        } catch (error) {
          handleError("Failed to load goal details. Please try refreshing the page.");
          console.error("Error fetching goal:", error);
        }
      }
    };

    const fetchMilestones = async () => {
      if (goalId) {
        try {
          const response = await milestoneApi.getMilestones(goalId);
          setMilestones(response.data.milestones);
        } catch (error) {
          handleError("Failed to load milestones. Please try refreshing the page.");
          console.error("Error fetching milestones:", error);
        }
      }
    };

    fetchGoalData();
    fetchMilestones();
  }, [goalId]);

  const handleMilestoneEdit = (id, field, value) => {
    setEditingMilestoneId(id);
    setEditingMilestoneField(field);
    setEditValue(value);
  };

  const handleTaskEdit = (id, field, value) => {
    setEditingTaskId(id);
    setEditingTaskField(field);
    setEditValue(value);
  };

  const handleMilestoneEditComplete = async () => {
    if (editingMilestoneId && editingMilestoneField) {
      try {
        const milestone = milestones.find(m => m.id === editingMilestoneId);
        if (!milestone || !currentGoal) {
          handleError("Milestone or goal information is not available. Please try refreshing the page.");
          return;
        }

        let updatedValue = editValue;

        if (editingMilestoneField === 'due_date') {
          const newDueDate = new Date(editValue);
          const goalStartDate = new Date(currentGoal.start_date);
          const goalEndDate = new Date(currentGoal.end_date);
          const today = new Date();

          // Set to end of day to ensure proper comparison
          newDueDate.setHours(23, 59, 59, 999);
          goalStartDate.setHours(23, 59, 59, 999);
          goalEndDate.setHours(23, 59, 59, 999);
          today.setHours(0, 0, 0, 0);

          if (newDueDate < today) {
            const errorMessage = "Due date must be after or equal to today";
            handleError(errorMessage);
            throw new Error(errorMessage);
          }

          if (newDueDate < goalStartDate || newDueDate > goalEndDate) {
            const errorMessage = `Due date must be between ${goalStartDate.toISOString().split('T')[0]} and ${goalEndDate.toISOString().split('T')[0]}`;
            handleError(errorMessage);
            throw new Error(errorMessage);
          }

          // Set to midnight UTC for consistency
          newDueDate.setUTCHours(0, 0, 0, 0);
          updatedValue = newDueDate.toISOString();
        }

        const updatedData = {
          ...milestone,
          [editingMilestoneField]: updatedValue
        };

        await milestoneApi.updateMilestone(goalId, editingMilestoneId, updatedData);

        setMilestones(prevMilestones =>
          prevMilestones.map(m =>
            m.id === editingMilestoneId
              ? { ...m, [editingMilestoneField]: updatedValue }
              : m
          )
        );
      } catch (error) {
        console.error("Error updating milestone:", error);
        setMilestones(prevMilestones => [...prevMilestones]);
        
        if (error.response?.data?.errors?.due_date) {
          handleError(error.response.data.errors.due_date[0]);
        } else {
          handleError(error.message || "Failed to update milestone. Please try again.");
        }
      }
    }
    setEditingMilestoneId(null);
    setEditingMilestoneField(null);
    setEditValue("");
  };

  const handleTaskEditComplete = () => {
    if (editingTaskId && editingTaskField) {
      setMilestones(
        milestones.map((milestone) => {
          if (milestone.id === editingMilestoneId) {
            return {
              ...milestone,
              tasks: milestone.tasks.map((task) =>
                task.id === editingTaskId
                  ? { ...task, [editingTaskField]: editValue }
                  : task
              ),
            };
          }
          return milestone;
        })
      );
    }
    setEditingTaskId(null);
    setEditingTaskField(null);
    setEditValue("");
  };

  const handleDeleteMilestone = (id) => {
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleDeleteTask = (milestoneId, taskId) => {
    setMilestones(
      milestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: milestone.tasks.filter((task) => task.id !== taskId),
          };
        }
        return milestone;
      })
    );
  };

  const handleToggleMilestoneComplete = async (id) => {
    try {
      const milestone = milestones.find(m => m.id === id);
      if (!milestone) {
        handleError("Milestone not found. Please try refreshing the page.");
        return;
      }

      const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
      const updatedData = {
        ...milestone,
        status: newStatus,
        progress_percentage: newStatus === 'completed' ? 100 : 0
      };

      await milestoneApi.updateMilestone(goalId, id, updatedData);

      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === id ? { ...m, status: newStatus, progress_percentage: newStatus === 'completed' ? 100 : 0 } : m
        )
      );
    } catch (error) {
      console.error("Error toggling milestone completion:", error);
      setMilestones(prevMilestones => [...prevMilestones]);
      handleError("Failed to update milestone status. Please try again.");
    }
  };

  const handleToggleTaskComplete = (milestoneId, taskId) => {
    setMilestones(
      milestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: milestone.tasks.map((task) =>
              task.id === taskId
                ? { ...task, completed: !task.completed }
                : task
            ),
          };
        }
        return milestone;
      })
    );
  };

  const handleAddMilestone = async () => {
    try {
      if (!currentGoal) {
        handleError("Goal information is not available. Please try refreshing the page.");
        return;
      }

      const today = new Date();
      const goalStartDate = new Date(currentGoal.start_date);
      const goalEndDate = new Date(currentGoal.end_date);

      // Set to end of day for proper comparison
      goalStartDate.setHours(23, 59, 59, 999);
      goalEndDate.setHours(23, 59, 59, 999);
      today.setHours(0, 0, 0, 0);

      let dueDate = today > goalStartDate ? today : goalStartDate;
      
      if (dueDate > goalEndDate) {
        dueDate = goalEndDate;
      }

      // Set to midnight UTC for API consistency
      dueDate.setUTCHours(0, 0, 0, 0);
      
      const newMilestoneData = {
        title: "Untitled",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: dueDate.toISOString(),
        progress_percentage: 0,
        tasks: [] // Initialize empty tasks array
      };

      const response = await milestoneApi.createMilestone(goalId, newMilestoneData);
      const createdMilestone = response.data;

      setMilestones(prevMilestones => [...prevMilestones, createdMilestone]);
      handleMilestoneEdit(createdMilestone.id, "title", "Untitled");
    } catch (error) {
      console.error("Error creating milestone:", error);
      if (error.response?.data?.errors?.due_date) {
        handleError(error.response.data.errors.due_date[0]);
      } else {
        handleError("Failed to create milestone. Please try again.");
      }
    }
  };

  const handleAddTask = (milestoneId) => {
    setMilestones(
      milestones.map((milestone) => {
        if (milestone.id === milestoneId) {
          return {
            ...milestone,
            tasks: [
              ...milestone.tasks,
              {
                id: Date.now(),
                title: "Untitle",
                completed: false,
                priority: "Medium",
                dueDate: "",
              },
            ],
          };
        }
        return milestone;
      })
    );
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          {currentGoal && (
            <>
              <GoalHeader goal={currentGoal} />
              <Box sx={{ mt: 4 }}>
                <GridContainer goal={currentGoal} />
              </Box>
              <Box sx={{ mt: 4 }}>
                {milestones.length > 0 ? (
                  milestones.map((milestone) => (
                    <Milestone
                      key={milestone.id}
                      milestone={milestone}
                      onToggleComplete={handleToggleMilestoneComplete}
                      onDelete={handleDeleteMilestone}
                      onEdit={handleMilestoneEdit}
                      onAddTask={handleAddTask}
                      onTaskToggleComplete={handleToggleTaskComplete}
                      onTaskDelete={handleDeleteTask}
                      onTaskEdit={handleTaskEdit}
                      isEditing={editingMilestoneId === milestone.id}
                      editValue={editValue}
                      onEditChange={setEditValue}
                      onEditComplete={handleMilestoneEditComplete}
                      editingTaskId={editingTaskId}
                      taskEditValue={editValue}
                      onTaskEditChange={setEditValue}
                      onTaskEditComplete={handleTaskEditComplete}
                    />
                  ))
                ) : (
                  <EmptyMilestoneState 
                    onAddClick={handleAddMilestone}
                    customMessage={`Start breaking down your goal "${currentGoal.title}" into achievable milestones. This will help you stay organized and track your progress effectively.`}
                    showTips={true}
                    animate={true}
                  />
                )}
              </Box>
            </>
          )}
        </Box>
      </Container>

      <AddMilestoneButton onClick={handleAddMilestone} />

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GoalHub;
