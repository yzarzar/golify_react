import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Stack,
  Chip,
  Button,
  LinearProgress,
  Collapse,
  InputBase,
  Tooltip,
  ClickAwayListener,
  Zoom,
  Popover,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import {
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  AccessTime as TimeIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Flag as FlagIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { format, isAfter, isBefore, isToday } from "date-fns";
import Task from "./Task";

const priorityColors = {
  light: {
    High: {
      main: "#dc2626",
      light: "#fef2f2",
      border: "#fee2e2",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    Medium: {
      main: "#d97706",
      light: "#fffbeb",
      border: "#fef3c7",
      gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    },
    Low: {
      main: "#059669",
      light: "#ecfdf5",
      border: "#d1fae5",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    },
  },
  dark: {
    High: {
      main: "#ef4444",
      light: "rgba(239, 68, 68, 0.15)",
      border: "rgba(239, 68, 68, 0.25)",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    Medium: {
      main: "#f59e0b",
      light: "rgba(245, 158, 11, 0.15)",
      border: "rgba(245, 158, 11, 0.25)",
      gradient: "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)",
    },
    Low: {
      main: "#10b981",
      light: "rgba(16, 185, 129, 0.15)",
      border: "rgba(16, 185, 129, 0.25)",
      gradient: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    },
  },
};

const Milestone = ({
  milestone,
  onToggleComplete,
  onDelete,
  onEdit,
  onTaskAdd,
  onTaskToggleComplete,
  onTaskDelete,
  onTaskEdit,
  editingTaskId,
  taskEditValue,
  onTaskEditChange,
  onTaskEditComplete,
}) => {
  const [expanded, setExpanded] = useState(milestone.expanded);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(milestone.title);
  const [showEditHint, setShowEditHint] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(milestone.description || "");
  const [showDescHint, setShowDescHint] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colors = priorityColors[isDark ? "dark" : "light"];

  const tasks = milestone.tasks || [];
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const getDueDateStatus = () => {
    if (!milestone.dueDate) return null;
    const dueDate = new Date(milestone.dueDate);
    const today = new Date();

    if (isToday(dueDate)) return "today";
    if (isBefore(dueDate, today)) return "overdue";
    if (isAfter(dueDate, today)) return "upcoming";
    return null;
  };

  const getDueDateColor = () => {
    const status = getDueDateStatus();
    switch (status) {
      case "overdue":
        return isDark ? "#ef4444" : "#dc2626";
      case "today":
        return isDark ? "#8b5cf6" : "#7c3aed";
      case "upcoming":
        return isDark ? "#10b981" : "#059669";
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(milestone.title);
  };

  const handleEditComplete = () => {
    if (editValue.trim() !== milestone.title.trim()) {
      onEdit("title", editValue.trim());
    }
    setIsEditing(false);
    setShowEditHint(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEditComplete();
    } else if (e.key === "Escape") {
      setEditValue(milestone.title);
      setIsEditing(false);
      setShowEditHint(false);
    }
  };

  const handleDateClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setDateAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      onEdit("dueDate", newDate.toISOString());
    }
    handleDateClose();
  };

  const handleClearDate = (event) => {
    event.stopPropagation();
    onEdit("dueDate", null);
  };

  const handlePriorityClick = (event) => {
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null);
  };

  const handlePriorityChange = (newPriority) => {
    onEdit("priority", newPriority);
    handlePriorityClose();
  };

  const isDatePickerOpen = Boolean(dateAnchorEl);
  const isPriorityMenuOpen = Boolean(priorityAnchorEl);

  const priorityOptions = [
    { value: "High", color: colors.High.main, description: "Urgent and important" },
    { value: "Medium", color: colors.Medium.main, description: "Important but not urgent" },
    { value: "Low", color: colors.Low.main, description: "Can be done later" },
  ];

  const handleDescriptionEdit = () => {
    setIsEditingDesc(true);
    setDescValue(milestone.description || "");
    setShowDescHint(false);
  };

  const handleDescriptionChange = (e) => {
    setDescValue(e.target.value);
  };

  const handleDescriptionComplete = () => {
    const trimmedValue = descValue.trim();
    if (trimmedValue !== milestone.description) {
      onEdit("description", trimmedValue || null);
    }
    setIsEditingDesc(false);
    setShowDescHint(false);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionComplete();
    } else if (e.key === "Escape") {
      setDescValue(milestone.description || "");
      setIsEditingDesc(false);
      setShowDescHint(false);
    }
  };

  return (
    <Zoom in style={{ transitionDelay: "50ms" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          backgroundColor: milestone.completed
            ? theme.palette.action.hover
            : theme.palette.background.paper,
          border: "1px solid",
          borderColor: milestone.completed
            ? theme.palette.divider
            : colors[milestone.priority].border,
          transition: "all 0.2s ease-in-out",
          overflow: "hidden",
          mb: 2,
          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
            "& .milestone-actions": {
              opacity: 1,
              transform: "translateX(0)",
            },
          },
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: "4px",
            backgroundColor: theme.palette.action.hover,
            "& .MuiLinearProgress-bar": {
              backgroundColor:
                progress === 100
                  ? colors[milestone.priority].main
                  : colors[milestone.priority].main,
            },
          }}
        />

        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <IconButton
              size="small"
              onClick={() => onToggleComplete(milestone.id)}
              sx={{
                color: milestone.completed
                  ? colors[milestone.priority].main
                  : theme.palette.action.disabled,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                  color: colors[milestone.priority].main,
                },
              }}
            >
              {milestone.completed ? <CheckCircleIcon /> : <UncheckedIcon />}
            </IconButton>

            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    transition: "transform 0.2s",
                    transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>

                {isEditing ? (
                  <ClickAwayListener onClickAway={handleEditComplete}>
                    <InputBase
                      fullWidth
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter milestone title..."
                      sx={{
                        "& input": {
                          p: "8px 12px",
                          borderRadius: "8px",
                          backgroundColor: theme.palette.action.hover,
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          transition: "all 0.2s",
                          "&::placeholder": {
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          },
                          "&:hover, &:focus": {
                            backgroundColor: theme.palette.action.selected,
                          },
                        },
                      }}
                      autoFocus
                    />
                  </ClickAwayListener>
                ) : (
                  <Box
                    onMouseEnter={() => setShowEditHint(true)}
                    onMouseLeave={() => setShowEditHint(false)}
                    sx={{ position: "relative", flex: 1 }}
                  >
                    <Typography
                      variant="h6"
                      onClick={handleEditStart}
                      sx={{
                        cursor: "text",
                        p: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: milestone.completed
                          ? theme.palette.text.secondary
                          : theme.palette.text.primary,
                        opacity: milestone.completed ? 0.7 : 1,
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {milestone.title}
                      {showEditHint && (
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{
                            ml: 1,
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          }}
                        >
                          Click to edit
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                )}

                <Stack
                  direction="row"
                  spacing={1}
                  className="items-center milestone-actions"
                  sx={{
                    opacity: 0,
                    transform: "translateX(10px)",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  <Tooltip
                    title={
                      milestone.dueDate
                        ? format(new Date(milestone.dueDate), "MMMM d, yyyy")
                        : "Set due date"
                    }
                    arrow
                  >
                    <Chip
                      size="small"
                      icon={<CalendarIcon sx={{ fontSize: "0.875rem" }} />}
                      label={
                        milestone.dueDate
                          ? format(new Date(milestone.dueDate), "MMM d")
                          : "Add date"
                      }
                      onClick={handleDateClick}
                      variant="outlined"
                      sx={{
                        borderRadius: "6px",
                        borderColor: theme.palette.divider,
                        color: theme.palette.text.primary,
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    />
                  </Tooltip>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Popover
                      open={isDatePickerOpen}
                      anchorEl={dateAnchorEl}
                      onClose={handleDateClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <DatePicker
                        value={milestone.dueDate ? new Date(milestone.dueDate) : null}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <Box sx={{ p: 2 }}>
                            <Button
                              startIcon={<ClearIcon />}
                              onClick={handleClearDate}
                              sx={{
                                mb: 1,
                                color: theme.palette.text.secondary,
                                justifyContent: "flex-start",
                                borderRadius: "8px",
                                p: 1,
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              Clear date
                            </Button>
                            {params.input}
                          </Box>
                        )}
                      />
                    </Popover>
                  </LocalizationProvider>

                  <Tooltip title={`Priority: ${milestone.priority}`} arrow>
                    <Chip
                      size="small"
                      icon={
                        <FlagIcon
                          sx={{
                            fontSize: "0.875rem",
                            color: colors[milestone.priority].main,
                          }}
                        />
                      }
                      label={milestone.priority}
                      onClick={handlePriorityClick}
                      sx={{
                        borderRadius: "6px",
                        backgroundColor: colors[milestone.priority].light,
                        borderColor: colors[milestone.priority].border,
                        color: colors[milestone.priority].main,
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: colors[milestone.priority].light,
                          opacity: 0.9,
                          transform: "translateY(-1px)",
                        },
                      }}
                    />
                  </Tooltip>

                  <Menu
                    anchorEl={priorityAnchorEl}
                    open={isPriorityMenuOpen}
                    onClose={handlePriorityClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1,
                        borderRadius: "12px",
                        minWidth: 220,
                        "& .MuiMenuItem-root": {
                          px: 2,
                          py: 1.5,
                          borderRadius: "8px",
                          mx: 1,
                          my: 0.5,
                        },
                      },
                    }}
                  >
                    {priorityOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        onClick={() => handlePriorityChange(option.value)}
                        selected={milestone.priority === option.value}
                        sx={{
                          transition: "all 0.2s",
                          "&:hover": {
                            backgroundColor: `${option.color}15`,
                          },
                          ...(milestone.priority === option.value && {
                            backgroundColor: `${option.color}15 !important`,
                          }),
                        }}
                      >
                        <ListItemIcon>
                          <FlagIcon
                            sx={{
                              color: option.color,
                              transition: "transform 0.2s",
                              transform: milestone.priority === option.value ? "scale(1.2)" : "scale(1)",
                            }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={option.value}
                          secondary={option.description}
                          primaryTypographyProps={{
                            sx: {
                              color: option.color,
                              fontWeight: milestone.priority === option.value ? 600 : 400,
                            },
                          }}
                          secondaryTypographyProps={{
                            sx: { fontSize: "0.75rem" },
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Menu>

                  <Tooltip title="Delete milestone" arrow>
                    <IconButton
                      size="small"
                      onClick={() => onDelete(milestone.id)}
                      sx={{
                        color: isDark
                          ? "rgba(255, 255, 255, 0.7)"
                          : theme.palette.text.secondary,
                        "&:hover": {
                          color: isDark ? "#f87171" : "#ef4444",
                          backgroundColor: isDark
                            ? "rgba(239, 68, 68, 0.15)"
                            : "#fee2e2",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              {/* Description Section */}
              <Box 
                sx={{ 
                  mt: 1.5,
                  ml: 5,
                  position: "relative",
                  "&:hover": {
                    "& .edit-hint": {
                      opacity: 1,
                    },
                  },
                }}
                onMouseEnter={() => setShowDescHint(true)}
                onMouseLeave={() => setShowDescHint(false)}
              >
                {isEditingDesc ? (
                  <ClickAwayListener onClickAway={handleDescriptionComplete}>
                    <InputBase
                      fullWidth
                      multiline
                      minRows={2}
                      maxRows={5}
                      placeholder="Add a description... (Shift + Enter for new line)"
                      value={descValue}
                      onChange={handleDescriptionChange}
                      onKeyDown={handleDescriptionKeyDown}
                      autoFocus
                      sx={{
                        "& textarea": {
                          color: theme.palette.text.primary,
                          fontSize: "0.875rem",
                          lineHeight: "1.5",
                          padding: "8px 12px",
                          transition: "all 0.2s",
                          backgroundColor: theme.palette.action.hover,
                          borderRadius: "8px",
                          "&::placeholder": {
                            color: theme.palette.text.secondary,
                            opacity: 0.7,
                          },
                          "&:hover, &:focus": {
                            backgroundColor: theme.palette.action.selected,
                          },
                        },
                      }}
                    />
                  </ClickAwayListener>
                ) : (
                  <Box
                    onClick={handleDescriptionEdit}
                    sx={{
                      cursor: "text",
                      position: "relative",
                      minHeight: "32px",
                      "&:hover": {
                        "& .description-content": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      },
                    }}
                  >
                    {milestone.description ? (
                      <Typography
                        variant="body2"
                        className="description-content"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.875rem",
                          lineHeight: "1.5",
                          whiteSpace: "pre-wrap",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          display: "inline-block",
                        }}
                      >
                        {milestone.description}
                        {showDescHint && (
                          <Typography
                            component="span"
                            className="edit-hint"
                            sx={{
                              ml: 1,
                              fontSize: "0.75rem",
                              color: theme.palette.primary.main,
                              opacity: 0,
                              transition: "opacity 0.2s",
                            }}
                          >
                            Click to edit
                          </Typography>
                        )}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        className="description-content"
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "0.875rem",
                          opacity: 0.7,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          fontStyle: "italic",
                        }}
                      >
                        Add a description...
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>

            </Box>
          </Stack>

          <Collapse in={expanded}>
            <Box sx={{ pl: 6, mt: 2 }}>
              <Stack spacing={1}>
                {tasks.map((task) => (
                  <Task
                    key={task.id}
                    task={task}
                    onToggleComplete={() =>
                      onTaskToggleComplete(milestone.id, task.id)
                    }
                    onDelete={() => onTaskDelete(milestone.id, task.id)}
                    onEdit={(field, value) => onTaskEdit(task.id, field, value)}
                    isEditing={editingTaskId === task.id}
                    editValue={taskEditValue}
                    onEditChange={onTaskEditChange}
                    onEditComplete={onTaskEditComplete}
                  />
                ))}
              </Stack>

              <Button
                startIcon={<AddIcon />}
                onClick={() => onTaskAdd(milestone.id)}
                sx={{
                  mt: 2,
                  color: theme.palette.text.secondary,
                  justifyContent: "flex-start",
                  borderRadius: "8px",
                  p: 1,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Add task
              </Button>
            </Box>
          </Collapse>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default Milestone;
