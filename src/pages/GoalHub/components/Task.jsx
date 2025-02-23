import React, { useState } from 'react';
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

const priorityColors = {
  light: {
    high: {
      main: '#dc2626',
      light: '#fef2f2',
      border: '#fee2e2',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
    },
    medium: {
      main: '#d97706',
      light: '#fffbeb',
      border: '#fef3c7',
      gradient: 'linear-gradient(135deg, #d97706 0%, #eab308 100%)'
    },
    low: {
      main: '#0ea5e9',
      light: '#f0f9ff',
      border: '#e0f2fe',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
    }
  },
  dark: {
    high: {
      main: '#ef4444',
      light: '#450a0a',
      border: '#7f1d1d',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
    },
    medium: {
      main: '#f59e0b',
      light: '#451a03',
      border: '#78350f',
      gradient: 'linear-gradient(135deg, #d97706 0%, #eab308 100%)'
    },
    low: {
      main: '#38bdf8',
      light: '#082f49',
      border: '#0c4a6e',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
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
  const [descriptionEditValue, setDescriptionEditValue] = useState(task.description || '');
  const [showEditHint, setShowEditHint] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const priorityColor = priorityColors[isDark ? 'dark' : 'light'][task.priority.toLowerCase()];
  const statusColor = statusColors[isDark ? 'dark' : 'light'][task.status];

  const dueDate = task.due_date ? new Date(task.due_date) : null;
  const isOverdue = dueDate && isBefore(dueDate, new Date()) && task.status !== 'completed';
  const isDueToday = dueDate && isToday(dueDate);

  const handleTitleEditStart = () => {
    setIsTitleEditing(true);
    setTitleEditValue(task.title);
    setShowEditHint(false);
  };

  const handleTitleEditComplete = () => {
    if (titleEditValue.trim() !== task.title) {
      onEdit(task.id, "title", titleEditValue.trim());
    }
    setIsTitleEditing(false);
  };

  const handleDescriptionEditStart = () => {
    setIsDescriptionEditing(true);
    setDescriptionEditValue(task.description || '');
    setShowEditHint(false);
  };

  const handleDescriptionEditComplete = () => {
    if (descriptionEditValue.trim() !== task.description) {
      onEdit(task.id, "description", descriptionEditValue.trim());
    }
    setIsDescriptionEditing(false);
  };

  const handleTitleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTitleEditComplete();
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

  const handlePrioritySelect = (priority) => {
    onEdit(task.id, "priority", priority);
    handlePriorityClose();
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
          onClick={onToggleComplete}
          sx={{
            color: task.status === 'completed'
              ? priorityColor.main
              : theme.palette.text.secondary,
            padding: '8px',
            '&:hover': {
              backgroundColor: priorityColor.light,
              color: priorityColor.main,
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
                    flex: 1,
                    '& input': {
                      color: theme.palette.text.primary,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: theme.palette.action.hover,
                      transition: 'all 0.2s',
                      '&:hover, &:focus': {
                        backgroundColor: theme.palette.action.selected,
                      },
                    },
                  }}
                />
              </ClickAwayListener>
            ) : (
              <Typography
                variant="body2"
                onClick={handleTitleEditStart}
                onMouseEnter={() => setShowEditHint(true)}
                onMouseLeave={() => setShowEditHint(false)}
                sx={{
                  flex: 1,
                  color: task.status === 'completed' ? theme.palette.text.secondary : theme.palette.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'text',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <span style={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {task.title}
                </span>
                {showEditHint && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 1,
                      fontSize: '0.75rem',
                      color: theme.palette.primary.main,
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        opacity: 0.7,
                      },
                    }}
                  >
                    Click to edit
                  </Typography>
                )}
              </Typography>
            )}
          </Box>

          <Box
            onMouseEnter={() => setShowEditHint(true)}
            onMouseLeave={() => setShowEditHint(false)}
            sx={{ 
              position: 'relative',
              mt: task.description || isDescriptionEditing ? 1.5 : 0.5,
              mb: task.description || isDescriptionEditing ? 1.5 : 0.5,
            }}
          >
            {task.description || isDescriptionEditing ? (
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
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {task.description}
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
              opacity: task.due_date || task.priority !== 'low' ? 1 : 0,
              transform: task.due_date || task.priority !== 'low' ? 'none' : 'translateY(10px)',
              transition: 'all 0.2s ease-in-out',
              height: task.due_date || task.priority !== 'low' ? 'auto' : 0,
              marginTop: task.description || isDescriptionEditing ? 0 : 1,
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

              <Tooltip
                title={`Priority: ${task.priority}`}
                arrow
              >
                <Chip
                  size="small"
                  icon={<FlagIcon sx={{ fontSize: '0.875rem' }} />}
                  label={task.priority}
                  onClick={handlePriorityClick}
                  variant="outlined"
                  sx={{
                    maxWidth: '100px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize'
                    },
                    '& .MuiChip-icon': {
                      fontSize: '0.875rem',
                      color: priorityColor.main
                    },
                    borderRadius: '4px',
                    backgroundColor: priorityColor.light,
                    borderColor: priorityColor.border,
                    color: priorityColor.main,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: priorityColor.light,
                      opacity: 0.9,
                      transform: 'translateY(-1px)',
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>
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
              {priorityOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handlePrioritySelect(option.value)}
                  selected={task.priority === option.value}
                  sx={{
                    '&:hover': {
                      backgroundColor: `${priorityColors[isDark ? 'dark' : 'light'][option.value].light}`,
                    },
                    ...(task.priority === option.value && {
                      backgroundColor: `${priorityColors[isDark ? 'dark' : 'light'][option.value].light} !important`,
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: priorityColors[isDark ? 'dark' : 'light'][option.value].main,
                      minWidth: 28,
                    }}
                  >
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.value}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '0.875rem',
                        color: priorityColors[isDark ? 'dark' : 'light'][option.value].main,
                        fontWeight: task.priority === option.value ? 600 : 400,
                      },
                    }}
                  />
                </MenuItem>
              ))}
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
