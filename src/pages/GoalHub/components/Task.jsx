import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  IconButton, 
  Typography, 
  Stack, 
  Box,
  Chip,
  InputBase,
  ClickAwayListener,
  Tooltip,
  Zoom,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Button,
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Flag as FlagIcon,
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format, isAfter, isBefore, isToday, isSameDay } from 'date-fns';
import { taskApi } from '../../../services/api';

const priorityColors = {
  light: {
    high: {
      main: "#dc2626",
      light: "#fef2f2",
      border: "#fee2e2",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    medium: {
      main: "#d97706",
      light: "#fffbeb",
      border: "#fef3c7",
      gradient: "linear-gradient(135deg, #d97706 0%, #eab308 100%)",
    },
    low: {
      main: "#0ea5e9",
      light: "#f0f9ff",
      border: "#e0f2fe",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    }
  },
  dark: {
    high: {
      main: "#ef4444",
      light: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.2)",
      gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
    },
    medium: {
      main: "#eab308",
      light: "rgba(234, 179, 8, 0.1)",
      border: "rgba(234, 179, 8, 0.2)",
      gradient: "linear-gradient(135deg, #d97706 0%, #eab308 100%)",
    },
    low: {
      main: "#38bdf8",
      light: "rgba(56, 189, 248, 0.1)",
      border: "rgba(56, 189, 248, 0.2)",
      gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    }
  }
};

const statusColors = {
  light: {
    completed: "#22c55e",
    in_progress: "#f59e0b",
    pending: "#64748b",
  },
  dark: {
    completed: "#22c55e",
    in_progress: "#f59e0b",
    pending: "#94a3b8",
  }
};

const Task = ({ 
  task, 
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [titleEditValue, setTitleEditValue] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [descriptionEditValue, setDescriptionEditValue] = useState(description);
  const [showEditHint, setShowEditHint] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState(task.priority);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    setTitle(task.title);
  }, [task.title]);

  useEffect(() => {
    setDescription(task.description || '');
  }, [task.description]);

  useEffect(() => {
    setPriority(task.priority);
  }, [task.priority]);

  const priorityColor = priorityColors[isDark ? 'dark' : 'light'][priority.toLowerCase()];
  const statusColor = statusColors[isDark ? 'dark' : 'light'][task.status];

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && isBefore(dueDate, new Date()) && task.status !== 'completed';
  const isDueToday = dueDate && isToday(dueDate);

  const handleTitleEditStart = () => {
    setIsTitleEditing(true);
    setTitleEditValue(title);
    setShowEditHint(false);
  };

  const handleTitleEditComplete = async () => {
    if (titleEditValue.trim() === "") {
      setTitleEditValue(title);
      setIsTitleEditing(false);
      return;
    }

    if (titleEditValue === title) {
      setIsTitleEditing(false);
      return;
    }

    try {
      const trimmedTitle = titleEditValue.trim();
      // First make the API call to update the backend
      await taskApi.updateTask(task.milestone_id, task.id, { title: trimmedTitle });
      // Then notify parent component to update its state
      await onEdit(task.id, "title", trimmedTitle);
      // Finally update local state
      setTitle(trimmedTitle);
      setTitleEditValue(trimmedTitle);
      setIsTitleEditing(false);
    } catch (error) {
      console.error("Error updating task title:", error);
      setTitleEditValue(title);
      setTitle(title);
      setIsTitleEditing(false);
    }
  };

  const handleTitleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTitleEditComplete();
    }
  };

  const handleDescriptionEditStart = () => {
    setIsDescriptionEditing(true);
    setDescriptionEditValue(description);
    setShowEditHint(false);
  };

  const handleDescriptionEditComplete = async () => {
    if (descriptionEditValue === description) {
      setIsDescriptionEditing(false);
      return;
    }

    try {
      const trimmedDescription = descriptionEditValue.trim();
      // First make the API call to update the backend
      await taskApi.updateTask(task.milestone_id, task.id, { description: trimmedDescription });
      // Then notify parent component to update its state
      await onEdit(task.id, "description", trimmedDescription);
      // Finally update local state
      setDescription(trimmedDescription);
      setIsDescriptionEditing(false);
    } catch (error) {
      console.error("Error updating task description:", error);
      setDescriptionEditValue(description);
      setDescription(description);
      setIsDescriptionEditing(false);
    }
  };

  const handleDescriptionKeyPress = (event) => {
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      handleDescriptionEditComplete();
    }
  };

  const handleDateClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setDateAnchorEl(null);
  };

  const handleTimeClick = (event) => {
    setTimeAnchorEl(event.currentTarget);
  };

  const handleTimeClose = () => {
    setTimeAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    if (newDate) {
      const currentTime = task.due_date ? new Date(task.due_date) : new Date();
      newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
      onEdit(task.id, "due_date", newDate.toISOString());
    }
    handleDateClose();
  };

  const handleTimeChange = (newTime) => {
    if (newTime) {
      const currentDate = task.due_date ? new Date(task.due_date) : new Date();
      currentDate.setHours(newTime.getHours(), newTime.getMinutes());
      onEdit(task.id, "due_date", currentDate.toISOString());
    }
    handleTimeClose();
  };

  const handleClearDate = (event) => {
    event.stopPropagation();
    onEdit(task.id, "due_date", null);
    setDateAnchorEl(null);
    setTimeAnchorEl(null);
  };

  const handlePriorityClick = (event) => {
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null);
  };

  const handlePrioritySelect = async (newPriority) => {
    try {
      // First make the API call to update the backend
      await taskApi.updateTask(task.milestone_id, task.id, { priority: newPriority });
      // Then notify parent component to update its state
      await onEdit(task.id, "priority", newPriority);
      // Finally update local state
      setPriority(newPriority);
      handlePriorityClose();
    } catch (error) {
      console.error("Error updating task priority:", error);
      setPriority(task.priority);
      handlePriorityClose();
      // You might want to show an error message here
    }
  };

  const isPriorityMenuOpen = Boolean(priorityAnchorEl);

  const priorityOptions = [
    { 
      value: 'high', 
      color: priorityColors[isDark ? 'dark' : 'light'].high.main, 
      description: 'Urgent and important',
      icon: <FlagIcon />
    },
    { 
      value: 'medium', 
      color: priorityColors[isDark ? 'dark' : 'light'].medium.main, 
      description: 'Important but not urgent',
      icon: <FlagIcon />
    },
    { 
      value: 'low', 
      color: priorityColors[isDark ? 'dark' : 'light'].low.main, 
      description: 'Can be done later',
      icon: <FlagIcon />
    }
  ];

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);

  useEffect(() => {
    // Start editing if this is a new task
    if (task.title === 'New Task' && !isEditing) {
      setIsEditing(true);
      setEditValue(task.title);
    }
  }, [task.title]);

  const handleEditSubmit = async () => {
    if (editValue.trim() === "") {
      // showAlert("Task title cannot be empty", "error");
      setEditValue(task.title);
      setIsEditing(false);
      return;
    }

    if (editValue === task.title) {
      setIsEditing(false);
      return;
    }

    try {
      // await onUpdateTask(task.id, { title: editValue });
      onEdit(task.id, "title", editValue);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating task title:", error);
      setEditValue(task.title);
      setIsEditing(false);
      // showAlert("Failed to update task title", "error");
    }
  };

  const handleStatusToggle = () => {
    onToggleComplete(task.id);
  };

  return (
    <Zoom in style={{ transitionDelay: '100ms' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          p: 1.5,
          pl: '16px',
          borderRadius: '10px',
          backgroundColor: task.status === 'completed' 
            ? theme.palette.action.hover 
            : theme.palette.background.paper,
          border: '1px solid',
          borderColor: task.status === 'completed' 
            ? theme.palette.divider 
            : priorityColor.border,
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: priorityColor.gradient,
            opacity: task.status === 'completed' ? 0.3 : 0.8,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDark 
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.06)',
            backgroundColor: task.status === 'completed' 
              ? isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.03)'
              : priorityColor.light,
            '& .task-actions': {
              opacity: 1,
              transform: 'translateX(0)',
            }
          }
        }}
      >
        <IconButton
          size="small"
          onClick={handleStatusToggle}
          sx={{
            color: task.status === 'completed'
              ? statusColor
              : theme.palette.text.secondary,
            padding: '8px',
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
              color: statusColor,
            },
          }}
        >
          {task.status === 'completed' ? (
            <CheckCircleIcon sx={{ fontSize: '1.25rem' }} />
          ) : (
            <UncheckedIcon sx={{ fontSize: '1.25rem' }} />
          )}
        </IconButton>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
            }}
          >
            {isTitleEditing ? (
              <ClickAwayListener onClickAway={handleTitleEditComplete}>
                <InputBase
                  fullWidth
                  value={titleEditValue}
                  onChange={(e) => setTitleEditValue(e.target.value)}
                  onKeyDown={handleTitleKeyPress}
                  autoFocus
                  sx={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: theme.palette.action.hover,
                    '& input': {
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                    },
                    '&:hover, &:focus-within': {
                      backgroundColor: theme.palette.action.selected,
                    },
                  }}
                />
              </ClickAwayListener>
            ) : (
              <Typography
                variant="body1"
                onClick={() => setIsTitleEditing(true)}
                sx={{
                  flex: 1,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  color: task.status === 'completed' 
                    ? theme.palette.text.secondary 
                    : theme.palette.text.primary,
                  '&:hover': {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                {title}
              </Typography>
            )}
          </Box>

          <Box
            onMouseEnter={() => setShowEditHint(true)}
            onMouseLeave={() => setShowEditHint(false)}
            sx={{ 
              position: 'relative',
              mt: description || isDescriptionEditing ? 1.5 : 0.5,
              mb: description || isDescriptionEditing ? 1.5 : 0.5,
            }}
          >
            {description || isDescriptionEditing ? (
              <Box
                onClick={!isDescriptionEditing ? handleDescriptionEditStart : undefined}
                sx={{
                  cursor: isDescriptionEditing ? 'default' : 'text',
                  position: 'relative',
                  '&:hover': {
                    '& .description-edit-hint': {
                      opacity: 1,
                    }
                  }
                }}
              >
                {isDescriptionEditing ? (
                  <ClickAwayListener onClickAway={handleDescriptionEditComplete}>
                    <InputBase
                      fullWidth
                      multiline
                      value={descriptionEditValue}
                      onChange={(e) => setDescriptionEditValue(e.target.value)}
                      onKeyDown={handleDescriptionKeyPress}
                      autoFocus
                      placeholder="Add a description..."
                      sx={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        backgroundColor: theme.palette.action.hover,
                        '& textarea': {
                          color: theme.palette.text.primary,
                          fontSize: '0.875rem',
                          lineHeight: 1.6,
                        },
                        '&:hover, &:focus-within': {
                          backgroundColor: theme.palette.action.selected,
                        },
                      }}
                    />
                  </ClickAwayListener>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      onClick={!isDescriptionEditing ? handleDescriptionEditStart : undefined}
                      sx={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        color: task.status === 'completed'
                          ? theme.palette.text.secondary
                          : theme.palette.text.primary,
                        opacity: task.status === 'completed' ? 0.7 : 0.9,
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-wrap',
                        transition: 'all 0.2s',
                        cursor: 'text',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {description || 'Add a description...'}
                    </Typography>
                    {showEditHint && (
                      <Typography
                        className="description-edit-hint"
                        variant="caption"
                        sx={{
                          position: 'absolute',
                          right: '8px',
                          top: '8px',
                          color: theme.palette.text.secondary,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          backgroundColor: theme.palette.background.paper,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          boxShadow: theme.shadows[1],
                          fontSize: '0.75rem',
                        }}
                      >
                        Click to edit
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            ) : (
              <Button
                onClick={handleDescriptionEditStart}
                startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                sx={{
                  color: theme.palette.text.secondary,
                  textTransform: 'none',
                  padding: '4px 8px',
                  minWidth: 0,
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.text.primary,
                  }
                }}
              >
                Add description
              </Button>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              transition: 'all 0.2s ease-in-out',
              marginTop: description || isDescriptionEditing ? 0 : 1,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
              '& > *': {
                flexShrink: 0,
              },
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip
                title={
                  task.due_date
                    ? `Date: ${format(new Date(task.due_date), 'MMMM d, yyyy')}`
                    : 'Set date'
                }
                arrow
              >
                <Chip
                  size="small"
                  icon={<CalendarIcon sx={{ fontSize: '0.875rem' }} />}
                  label={
                    task.due_date
                      ? format(new Date(task.due_date), 'MMM d')
                      : 'Add date'
                  }
                  onClick={handleDateClick}
                  onDelete={task.due_date ? handleClearDate : undefined}
                  variant="outlined"
                  sx={{
                    maxWidth: '120px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    },
                    '& .MuiChip-deleteIcon': {
                      fontSize: '0.875rem',
                      ml: 0.75,
                    },
                    borderRadius: '4px',
                    borderColor: task.due_date ? statusColor : theme.palette.divider,
                    color: task.due_date ? statusColor : theme.palette.text.secondary,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      borderColor: task.due_date ? statusColor : theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>

              <Tooltip
                title={
                  task.due_date
                    ? `Time: ${format(new Date(task.due_date), 'h:mm a')}`
                    : 'Set time'
                }
                arrow
              >
                <Chip
                  size="small"
                  icon={<TimeIcon sx={{ fontSize: '0.875rem' }} />}
                  label={
                    task.due_date
                      ? format(new Date(task.due_date), 'h:mm a')
                      : 'Add time'
                  }
                  onClick={handleTimeClick}
                  variant="outlined"
                  sx={{
                    maxWidth: '110px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    },
                    '& .MuiChip-icon': {
                      fontSize: '0.875rem',
                      ml: 0.75,
                    },
                    borderRadius: '4px',
                    borderColor: task.due_date ? statusColor : theme.palette.divider,
                    color: task.due_date ? statusColor : theme.palette.text.secondary,
                    backgroundColor: 'transparent',
                    '&:hover': {
                      borderColor: task.due_date ? statusColor : theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Tooltip 
                  title={`Priority: ${priority}`}
                  placement="top"
                >
                  <IconButton
                    size="small"
                    onClick={handlePriorityClick}
                    sx={{
                      color: priorityColors[isDark ? 'dark' : 'light'][priority.toLowerCase()].main,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <FlagIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Stack>

            <Popover
              open={Boolean(dateAnchorEl)}
              anchorEl={dateAnchorEl}
              onClose={handleDateClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={task.due_date ? new Date(task.due_date) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { m: 1, minWidth: 220 },
                    },
                  }}
                />
              </LocalizationProvider>
            </Popover>

            <Popover
              open={Boolean(timeAnchorEl)}
              anchorEl={timeAnchorEl}
              onClose={handleTimeClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <TimePicker
                  value={task.due_date ? new Date(task.due_date) : null}
                  onChange={handleTimeChange}
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { m: 1, minWidth: 120 },
                    },
                  }}
                />
              </LocalizationProvider>
            </Popover>

            <Popover
              open={Boolean(priorityAnchorEl)}
              anchorEl={priorityAnchorEl}
              onClose={handlePriorityClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  boxShadow: theme.shadows[2],
                  '& .MuiMenuItem-root': {
                    px: 1.5,
                    py: 0.75,
                    minWidth: 120,
                  },
                },
              }}
            >
              {priorityOptions.map((priority) => {
                const priorityColor = priorityColors[isDark ? 'dark' : 'light'][priority.value];
                return (
                  <MenuItem
                    key={priority.value}
                    onClick={() => handlePrioritySelect(priority.value)}
                    selected={task.priority === priority.value}
                    sx={{
                      '&:hover': {
                        backgroundColor: priorityColor.light,
                      },
                      ...(task.priority === priority.value && {
                        backgroundColor: `${priorityColor.light} !important`,
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: priorityColor.main,
                        minWidth: 28,
                      }}
                    >
                      <FlagIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={priority.value.charAt(0).toUpperCase() + priority.value.slice(1)}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          color: priorityColor.main,
                          fontWeight: task.priority === priority.value ? 600 : 400,
                        },
                      }}
                    />
                  </MenuItem>
                );
              })}
            </Popover>

            <IconButton
              size="small"
              onClick={onDelete}
              sx={{
                color: theme.palette.text.secondary,
                opacity: 0,
                transform: 'translateX(-10px)',
                transition: 'all 0.2s ease-in-out',
                flexShrink: 0,
                width: '24px',
                height: '24px',
                '&:hover': {
                  color: theme.palette.error.main,
                  backgroundColor: `${theme.palette.error.main}15`,
                },
              }}
              className="task-actions"
            >
              <DeleteIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Stack>
        </Box>
      </Paper>
    </Zoom>
  );
};

export default Task;
