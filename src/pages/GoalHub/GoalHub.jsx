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
import AlertBox from "../../components/AlertBox";
import useAlert from "../../hooks/useAlert";
import { useLocation } from "react-router-dom";
import { goalApi, milestoneApi, taskApi } from "../../services/api";

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
  const { alert, showAlert, hideAlert } = useAlert();

  const fetchGoalData = async () => {
    try {
      const response = await goalApi.getGoal(goalId);
      const goalData = response.data;
      setCurrentGoal(goalData);

      // Ensure each milestone has a tasks array
      try {
        const milestonesWithTasks = goalData.milestones.map(milestone => ({
          ...milestone,
          tasks: milestone.tasks || []
        }));
        setMilestones(milestonesWithTasks);
      } catch {
        // Silently handle the map error since it doesn't affect functionality
      }
    } catch (error) {
      console.error("Error fetching goal data:", error);
      showAlert("Failed to fetch goal data", "error");
    }
  };

  useEffect(() => {
    const fetchMilestones = async () => {
      if (goalId) {
        try {
          const response = await milestoneApi.getMilestones(goalId);
          setMilestones(response.data.milestones);
        } catch (error) {
          console.error("Error fetching milestones:", error);
          showAlert(
            error.response?.data?.message || "Failed to fetch milestones",
            'error'
          );
        }
      }
    };

    fetchGoalData();
    fetchMilestones();
  }, [goalId]);

  const handleError = (message) => {
    showAlert(message, 'error');
  };

  const handleSuccess = (message) => {
    showAlert(message, 'success');
  };

  const handleMilestoneEdit = async (milestoneId, field, value) => {
    try {
      const response = await milestoneApi.updateMilestone(goalId, milestoneId, {
        [field]: value
      });

      setMilestones(prevMilestones =>
        prevMilestones.map(milestone =>
          milestone.id === milestoneId
            ? { ...milestone, [field]: value }
            : milestone
        )
      );

      // Refetch goal data to update stats
      await fetchGoalData();
      
      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error updating milestone:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update milestone. Please try again.", 'error');
      }
    }
  };

  const handleTaskEdit = async (id, field, value) => {
    try {
      // Find the milestone that contains the task
      const milestone = milestones.find(m => 
        m.tasks && m.tasks.some(t => t.id === id)
      );

      if (!milestone) {
        handleError("Task not found");
        return;
      }

      // Update local state immediately
      setMilestones(prevMilestones => {
        const updatedMilestones = prevMilestones.map(m => ({
          ...m,
          tasks: m.tasks?.map(task =>
            task.id === id
              ? { ...task, [field]: value }
              : task
          ) || []
        }));

        // Sort tasks by priority if priority was updated
        if (field === 'priority') {
          return updatedMilestones.map(m => ({
            ...m,
            tasks: [...(m.tasks || [])].sort((a, b) => {
              const priorityOrder = { high: 0, medium: 1, low: 2 };
              return priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()];
            })
          }));
        }

        return updatedMilestones;
      });

      // Refetch goal data to update stats
      await fetchGoalData();
      
      handleSuccess("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.response?.data) {
        handleError(error.response.data.message);
      } else {
        handleError("Failed to update task. Please try again.");
      }
      
      // Revert the local state on error by re-fetching
      await fetchGoalData();
    }
  };

  const handleMilestoneEditComplete = async () => {
    if (!editingMilestoneId || !editingMilestoneField) {
      setEditingMilestoneId(null);
      setEditingMilestoneField(null);
      setEditValue("");
      return;
    }

    const milestone = milestones.find((m) => m.id === editingMilestoneId);

    try {
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
          showAlert(errorMessage, 'error');
          throw new Error(errorMessage);
        }

        if (newDueDate < goalStartDate || newDueDate > goalEndDate) {
          const errorMessage = `Due date must be between ${goalStartDate.toISOString().split('T')[0]} and ${goalEndDate.toISOString().split('T')[0]}`;
          showAlert(errorMessage, 'error');
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

      const response = await milestoneApi.updateMilestone(goalId, editingMilestoneId, updatedData);

      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === editingMilestoneId
            ? { ...m, [editingMilestoneField]: updatedValue }
            : m
        )
      );

      // Refetch goal data to update stats
      await fetchGoalData();

      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error updating milestone:", error);
      setMilestones(prevMilestones => [...prevMilestones]);
      
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update milestone. Please try again.", 'error');
      }
    }
    setEditingMilestoneId(null);
    setEditingMilestoneField(null);
    setEditValue("");
  };

  const handleTaskEditComplete = async () => {
    if (!editingTaskId || !editingTaskField) {
      setEditingTaskId(null);
      setEditingTaskField(null);
      setEditValue("");
      return;
    }

    // Find the milestone that contains the task
    const milestone = milestones.find(m => 
      m.tasks && m.tasks.some(t => t.id === editingTaskId)
    );

    if (!milestone) {
      handleError("Task not found");
      return;
    }

    try {
      // Make the API call to update the task
      const response = await taskApi.updateTask(milestone.id, editingTaskId, {
        [editingTaskField]: editValue
      });

      // Update local state
      setMilestones(prevMilestones =>
        prevMilestones.map(m => {
          if (!m.tasks) return m;
          const updatedTasks = m.tasks.map(task =>
            task.id === editingTaskId
              ? { ...task, [editingTaskField]: editValue }
              : task
          );
          return { ...m, tasks: updatedTasks };
        })
      );

      // Refetch goal data to update stats
      await fetchGoalData();
      
      handleSuccess(response.message || "Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      if (error.response?.data) {
        handleError(error.response.data.message);
      } else {
        handleError("Failed to update task. Please try again.");
      }
    }

    setEditingTaskId(null);
    setEditingTaskField(null);
    setEditValue("");
  };

  const handleDeleteMilestone = async (id) => {
    try {
      const response = await milestoneApi.deleteMilestone(goalId, id);
      setMilestones(milestones.filter((m) => m.id !== id));
      
      // Refetch goal data to update stats
      await fetchGoalData();
      
      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error deleting milestone:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to delete milestone. Please try again.", 'error');
      }
    }
  };

  const handleDeleteTask = async (milestoneId, taskId) => {
    try {
      const response = await taskApi.deleteTask(milestoneId, taskId);
      
      // Update local state
      setMilestones(prevMilestones =>
        prevMilestones.map(milestone => {
          if (milestone.id !== milestoneId) return milestone;
          
          // Filter out the deleted task
          const updatedTasks = milestone.tasks.filter(task => task.id !== taskId);
          
          // Calculate new milestone progress based on remaining tasks
          const totalTasks = updatedTasks.length;
          const completedTasks = updatedTasks.filter(task => task.status === 'completed').length;
          const newProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
          
          // Determine new milestone status
          const newStatus = totalTasks === 0 || newProgress < 100 ? 'pending' : 'completed';
          
          return {
            ...milestone,
            tasks: updatedTasks,
            progress_percentage: newProgress,
            status: newStatus
          };
        })
      );

      // Refetch goal data to update stats
      await fetchGoalData();
      
      handleSuccess(response.message || "Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.data) {
        handleError(error.response.data.message);
      } else {
        handleError("Failed to delete task. Please try again.");
      }
      
      // Revert the local state on error by re-fetching
      await fetchGoalData();
    }
  };

  const handleToggleMilestoneComplete = async (milestoneId) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      const newStatus = milestone.status === 'completed' ? 'pending' : 'completed';
      const newProgress = newStatus === 'completed' ? 100 : 0;
      
      const response = await milestoneApi.updateMilestone(goalId, milestoneId, {
        status: newStatus,
        progress_percentage: newProgress
      });

      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === milestoneId
            ? { ...m, status: newStatus, progress_percentage: newProgress }
            : m
        )
      );

      await fetchGoalData();
      
      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error toggling milestone status:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update milestone status. Please try again.", 'error');
      }
    }
  };

  const handleToggleTaskComplete = async (milestoneId, taskId) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      const task = milestone.tasks.find(t => t.id === taskId);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';

      // Update task status using taskApi
      const response = await taskApi.updateTask(milestoneId, taskId, {
        status: newStatus
      });

      // Update local state
      const updatedTasks = milestone.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      
      const completedTasks = updatedTasks.filter(t => t.status === 'completed').length;
      const totalTasks = updatedTasks.length;
      const newProgress = Math.round((completedTasks / totalTasks) * 100);

      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === milestoneId
            ? {
                ...m,
                progress_percentage: newProgress,
                status: newProgress === 100 ? 'completed' : newProgress === 0 ? 'pending' : 'in_progress',
                tasks: updatedTasks
              }
            : m
        )
      );

      // Refetch goal data to update stats
      await fetchGoalData();
      
      showAlert(response.message || 'Task status updated successfully', 'success');
    } catch (error) {
      console.error("Error toggling task status:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update task status. Please try again.", 'error');
      }
    }
  };

  const handleAddTask = async (milestoneId) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        showAlert('Milestone not found', 'error');
        return;
      }

      // Format the due date to match milestone's date format
      const milestoneDueDate = new Date(milestone.due_date);
      milestoneDueDate.setUTCHours(0, 0, 0, 0);

      const newTask = {
        title: 'New Task',
        description: '',
        status: 'pending',
        priority: 'medium',
        due_date: milestoneDueDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
      };

      const response = await taskApi.createTask(milestoneId, newTask);
      const createdTask = response.data;

      // Update local state with safe array spread
      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === milestoneId
            ? {
                ...m,
                tasks: Array.isArray(m.tasks) ? [...m.tasks, createdTask] : [createdTask]
              }
            : m
        )
      );

      // Start editing the new task immediately
      handleTaskEdit(createdTask.id, "title", "New Task");

      // Refetch goal data to update stats
      await fetchGoalData();
      
      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error adding task:", error);
      if (error.response?.data) {
        const errorMessage = error.response.data.errors?.due_date?.[0] || error.response.data.message;
        showAlert(errorMessage, 'error');
      } else {
        showAlert("Failed to create task. Please try again.", 'error');
      }
    }
  };

  const handleAddMilestone = async () => {
    try {
      const today = new Date();
      const goalStartDate = new Date(currentGoal.start_date);
      const goalEndDate = new Date(currentGoal.end_date);

      goalStartDate.setHours(23, 59, 59, 999);
      goalEndDate.setHours(23, 59, 59, 999);
      today.setHours(0, 0, 0, 0);

      let dueDate = today > goalStartDate ? today : goalStartDate;
      
      if (dueDate > goalEndDate) {
        dueDate = goalEndDate;
      }

      dueDate.setUTCHours(0, 0, 0, 0);
      
      const newMilestoneData = {
        title: "Untitled",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: dueDate.toISOString(),
        progress_percentage: 0,
        tasks: []
      };

      const response = await milestoneApi.createMilestone(goalId, newMilestoneData);
      // Ensure the created milestone has a tasks array
      const createdMilestone = {
        ...response.data,
        tasks: []
      };

      setMilestones(prevMilestones => [...prevMilestones, createdMilestone]);
      handleMilestoneEdit(createdMilestone.id, "title", "Untitled");
      
      await fetchGoalData();

      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error creating milestone:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to create milestone. Please try again.", 'error');
      }
    }
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
                      onToggleComplete={() => handleToggleMilestoneComplete(milestone.id)}
                      onDelete={() => handleDeleteMilestone(milestone.id)}
                      onEdit={(field, value) => handleMilestoneEdit(milestone.id, field, value)}
                      onAddTask={() => handleAddTask(milestone.id)}
                      onTaskToggleComplete={handleToggleTaskComplete}
                      onTaskDelete={handleDeleteTask}
                      onTaskEdit={handleTaskEdit}
                      editingTaskId={editingTaskId}
                      taskEditValue={editValue}
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

      <AlertBox
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={hideAlert}
      />
    </Box>
  );
};

export default GoalHub;
