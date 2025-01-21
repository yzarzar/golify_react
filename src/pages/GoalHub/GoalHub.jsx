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
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    const fetchGoalData = async () => {
      if (goalId) {
        try {
          const response = await goalApi.getGoal(goalId);
          setCurrentGoal(response.data);
        } catch (error) {
          console.error("Error fetching goal:", error);
          showAlert(
            error.response?.data?.message || "Failed to fetch goal data",
            'error'
          );
        }
      }
    };

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
          showAlert("Milestone or goal information is not available. Please try refreshing the page.", 'error');
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
    }
    setEditingMilestoneId(null);
    setEditingMilestoneField(null);
    setEditValue("");
  };

  const handleTaskEditComplete = () => {
    if (editingTaskId && editingTaskField) {
      try {
        setMilestones(prevMilestones =>
          prevMilestones.map(milestone => {
            if (!milestone.tasks) return milestone;
            const updatedTasks = milestone.tasks.map(task =>
              task.id === editingTaskId
                ? { ...task, [editingTaskField]: editValue }
                : task
            );
            return { ...milestone, tasks: updatedTasks };
          })
        );

        showAlert("Task updated successfully", 'success');
      } catch (error) {
        console.error("Error updating task:", error);
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
      const response = await milestoneApi.deleteTask(goalId, milestoneId, taskId);
      setMilestones(prevMilestones =>
        prevMilestones.map(milestone => {
          if (milestone.id !== milestoneId) return milestone;
          return {
            ...milestone,
            tasks: milestone.tasks.filter(task => task.id !== taskId)
          };
        })
      );
      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error deleting task:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to delete task. Please try again.", 'error');
      }
    }
  };

  const handleToggleTaskComplete = async (milestoneId, taskId) => {
    try {
      let updatedTask = null;
      setMilestones(prevMilestones =>
        prevMilestones.map(milestone => {
          if (milestone.id !== milestoneId) return milestone;
          const updatedTasks = milestone.tasks.map(task => {
            if (task.id !== taskId) return task;
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            updatedTask = {
              ...task,
              status: newStatus,
              progress_percentage: newStatus === 'completed' ? 100 : 0
            };
            return updatedTask;
          });
          return { ...milestone, tasks: updatedTasks };
        })
      );

      if (updatedTask) {
        const response = await milestoneApi.updateTask(goalId, milestoneId, taskId, updatedTask);
        showAlert(response.message, 'success');
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update task status. Please try again.", 'error');
      }
    }
  };

  const handleAddTask = async (milestoneId) => {
    try {
      const newTask = {
        title: "New Task",
        description: "",
        status: "pending",
        progress_percentage: 0
      };

      const response = await milestoneApi.createTask(goalId, milestoneId, newTask);
      const createdTask = response.data;

      setMilestones(prevMilestones =>
        prevMilestones.map(milestone => {
          if (milestone.id !== milestoneId) return milestone;
          return {
            ...milestone,
            tasks: [...(milestone.tasks || []), createdTask]
          };
        })
      );

      showAlert(response.message, 'success');

      // Start editing the new task's title
      handleTaskEdit(createdTask.id, "title", "New Task");
    } catch (error) {
      console.error("Error adding task:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to add task. Please try again.", 'error');
      }
    }
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

      const response = await milestoneApi.updateMilestone(goalId, id, updatedData);

      setMilestones(prevMilestones =>
        prevMilestones.map(m =>
          m.id === id ? { ...m, status: newStatus, progress_percentage: newStatus === 'completed' ? 100 : 0 } : m
        )
      );

      showAlert(response.message, 'success');
    } catch (error) {
      console.error("Error toggling milestone completion:", error);
      if (error.response?.data) {
        showAlert(error.response.data.message, 'error');
      } else {
        showAlert("Failed to update milestone status. Please try again.", 'error');
      }
    }
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
