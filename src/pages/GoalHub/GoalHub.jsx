import React, { useState, useRef, useEffect } from "react";
import { Box, Container, Fab, Zoom } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import GoalHeader from "./components/GoalHeader";
import GridContainer from "./components/GridContainer";
import Milestone from "./components/Milestone";
import { useLocation } from "react-router-dom";
import { goalApi } from "../../services/api";

const GoalHub = () => {
  const location = useLocation();
  const [currentGoal, setCurrentGoal] = useState(null);
  const goalId = new URLSearchParams(location.search).get("goalId");

  useEffect(() => {
    const fetchGoalData = async () => {
      if (goalId) {
        try {
          const response = await goalApi.getGoal(goalId);
          setCurrentGoal(response.data);
        } catch (error) {
          console.error("Error fetching goal:", error);
        }
      }
    };

    fetchGoalData();
  }, [goalId]);

  const [milestones, setMilestones] = useState(
    currentGoal
      ? currentGoal.milestones
      : [
          {
            id: 2,
            goal_id: 1,
            title: "Complete the project",
            description: null,
            due_date: "2025-01-23",
            status: "pending",
            priority: "high",
            progress_percentage: 50,
            tasks: [
              {
                id: 32,
                milestone_id: 2,
                title: "New Task",
                description: "Task description",
                status: "in_progress",
                priority: "high",
                due_date: "2025-01-23T00:00:00.000000Z",
              },
              {
                id: 33,
                milestone_id: 2,
                title: "New Task",
                description: "Task description",
                status: "in_progress",
                priority: "medium",
                due_date: "2025-01-23T00:00:00.000000Z"
              },
              {
                id: 34,
                milestone_id: 2,
                title: "New Task",
                description: "Task description",
                status: "in_progress",
                priority: "low",
                due_date: "2025-01-23T00:00:00.000000Z",
              },
              {
                id: 35,
                milestone_id: 2,
                title: "New Task",
                description: "Task description",
                status: "in_progress",
                priority: "high",
                due_date: "2025-01-23T00:00:00.000000Z",
              }
            ]
          }
        ]
  );

  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [editingMilestoneField, setEditingMilestoneField] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskField, setEditingTaskField] = useState(null);
  const [editValue, setEditValue] = useState("");

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

  const handleMilestoneEditComplete = () => {
    if (editingMilestoneId && editingMilestoneField) {
      setMilestones(
        milestones.map((m) =>
          m.id === editingMilestoneId
            ? { ...m, [editingMilestoneField]: editValue }
            : m
        )
      );
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

  const handleToggleMilestoneComplete = (id) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    );
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

  const handleAddMilestone = () => {
    const newMilestone = {
      id: Date.now(),
      title: "Untitle",
      completed: false,
      dueDate: "",
      expanded: true,
      priority: "Medium",
      description: "",
      tasks: [],
    };
    setMilestones([...milestones, newMilestone]);
    handleMilestoneEdit(newMilestone.id, "title", "Untitle");
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
                {milestones.map((milestone) => (
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
                ))}
              </Box>
            </>
          )}
        </Box>
      </Container>

      {/* Floating Action Button for Add Milestone */}
      <Zoom in>
        <Fab
          color="primary"
          aria-label="add milestone"
          onClick={handleAddMilestone}
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24, md: 40 },
            bottom: { xs: 16, sm: 24, md: 40 },
            width: 64,
            height: 64,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            },
            transition: "all 0.2s ease-in-out",
            "& .MuiSvgIcon-root": {
              fontSize: 28,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Zoom>
    </Box>
  );
};

export default GoalHub;
