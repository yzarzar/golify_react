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
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker, DateTimePicker } from '@mui/x-date-pickers';
import { format, isAfter, isBefore, isToday, isSameDay } from 'date-fns';

const priorityColors = {
  light: {
    High: {
      main: '#dc2626',
      light: '#fef2f2',
      border: '#fee2e2',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
    },
    Medium: {
      main: '#d97706',
      light: '#fffbeb',
      border: '#fef3c7',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
    },
    Low: {
      main: '#059669',
      light: '#ecfdf5',
      border: '#d1fae5',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    }
  },
  dark: {
    High: {
      main: '#ef4444',
      light: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.2)',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
    },
    Medium: {
      main: '#f59e0b',
      light: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.2)',
      gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
    },
    Low: {
      main: '#10b981',
      light: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.2)',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    }
  }
};

const Task = ({ 
  task, 
  onToggleComplete, 
  onDelete, 
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  const [showEditHint, setShowEditHint] = useState(false);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colors = priorityColors[isDark ? 'dark' : 'light'];

  const handleEditStart = () => {
    setIsEditing(true);
    setEditValue(task.title);
  };

  const handleEditChange = (e) => {
    setEditValue(e.target.value);
  };

  const handleEditComplete = () => {
    if (editValue.trim() !== task.title) {
      onEdit('title', editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEditComplete();
    } else if (e.key === 'Escape') {
      setEditValue(task.title);
      setIsEditing(false);
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
      onEdit('dueDate', newDate.toISOString());
    }
    handleDateClose();
  };

  const handleClearDate = (event) => {
    event.stopPropagation();
    onEdit('dueDate', null);
  };

  const handleTimeClick = (event) => {
    setTimeAnchorEl(event.currentTarget);
  };

  const handleTimeClose = () => {
    setTimeAnchorEl(null);
  };

  const handleTimeChange = (newTime) => {
    if (!task.dueDate) {
      // If no date is set, use today's date with the selected time
      const today = new Date('2025-01-20T12:43:39+06:30');
      today.setHours(newTime.getHours(), newTime.getMinutes());
      onEdit('dueDate', today.toISOString());
    } else {
      // Keep the existing date but update the time
      const updatedDate = new Date(task.dueDate);
      updatedDate.setHours(newTime.getHours(), newTime.getMinutes());
      onEdit('dueDate', updatedDate.toISOString());
    }
    handleTimeClose();
  };

  const handlePriorityClick = (event) => {
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null);
  };

  const handlePriorityChange = (newPriority) => {
    onEdit('priority', newPriority);
    handlePriorityClose();
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const now = new Date('2025-01-20T12:42:49+06:30');
    
    if (isSameDay(dueDate, now)) return 'today';
    if (isBefore(dueDate, now)) return 'overdue';
    if (isAfter(dueDate, now)) return 'upcoming';
    return null;
  };

  const getDueDateColor = () => {
    const status = getDueDateStatus();
    switch (status) {
      case 'overdue':
        return isDark ? '#f87171' : '#ef4444';
      case 'today':
        return isDark ? '#a78bfa' : '#8b5cf6';
      case 'upcoming':
        return isDark ? '#34d399' : '#10b981';
      default:
        return theme.palette.text.secondary;
    }
  };

  const isDatePickerOpen = Boolean(dateAnchorEl);
  const isTimePickerOpen = Boolean(timeAnchorEl);
  const isPriorityMenuOpen = Boolean(priorityAnchorEl);

  const priorityOptions = [
    { value: 'High', color: colors.High.main, description: 'Urgent and important' },
    { value: 'Medium', color: colors.Medium.main, description: 'Important but not urgent' },
    { value: 'Low', color: colors.Low.main, description: 'Can be done later' },
  ];

  return (
    <Zoom in style={{ transitionDelay: '100ms' }}>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          p: 1.5,
          borderRadius: '10px',
          backgroundColor: task.completed 
            ? isDark 
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(0,0,0,0.02)'
            : theme.palette.background.paper,
          border: '1px solid',
          borderColor: task.completed 
            ? theme.palette.divider 
            : colors[task.priority].border,
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: isDark 
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.06)',
            backgroundColor: task.completed 
              ? isDark
                ? 'rgba(255,255,255,0.03)'
                : 'rgba(0,0,0,0.03)'
              : colors[task.priority].light,
            '& .task-actions': {
              opacity: 1,
              transform: 'translateX(0)',
            }
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: colors[task.priority].gradient,
            opacity: task.completed ? 0.3 : 0.8
          }}
        />
        
        <IconButton
          size="small"
          onClick={onToggleComplete}
          sx={{ 
            mr: 1.5,
            color: task.completed ? colors[task.priority].main : theme.palette.action.disabled,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              color: colors[task.priority].main
            }
          }}
        >
          {task.completed ? <CheckCircleIcon /> : <UncheckedIcon />}
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack spacing={1}>
            <Box
              onMouseEnter={() => setShowEditHint(true)}
              onMouseLeave={() => setShowEditHint(false)}
              sx={{ position: 'relative' }}
            >
              {isEditing ? (
                <ClickAwayListener onClickAway={handleEditComplete}>
                  <InputBase
                    fullWidth
                    value={editValue}
                    onChange={handleEditChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter task title..."
                    sx={{
                      '& input': {
                        padding: '6px 8px',
                        borderRadius: '6px',
                        backgroundColor: theme.palette.action.hover,
                        fontSize: '0.95rem',
                        color: theme.palette.text.primary,
                        transition: 'all 0.2s',
                        '&::placeholder': {
                          color: theme.palette.text.secondary,
                          opacity: 0.7,
                        },
                        '&:hover, &:focus': {
                          backgroundColor: theme.palette.action.selected,
                        }
                      }
                    }}
                    autoFocus
                  />
                </ClickAwayListener>
              ) : (
                <Typography
                  onClick={handleEditStart}
                  sx={{
                    cursor: 'text',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    color: task.completed
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary,
                    textDecoration: task.completed ? 'line-through' : 'none',
                    opacity: task.completed ? 0.7 : 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{task.title}</span>
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
              )}
            </Box>

            <Stack
              direction="row"
              spacing={1}
              className="items-center task-actions"
              sx={{
                opacity: 0,
                transform: 'translateX(-10px)',
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Stack direction="row" spacing={0.5}>
                <Tooltip
                  title={
                    task.dueDate
                      ? `Date: ${format(new Date(task.dueDate), 'MMMM d, yyyy')}`
                      : 'Set date'
                  }
                  arrow
                >
                  <Chip
                    size="small"
                    icon={<CalendarIcon sx={{ fontSize: '0.875rem' }} />}
                    deleteIcon={
                      task.dueDate && (
                        <ClearIcon
                          sx={{
                            fontSize: '0.875rem',
                            '&:hover': {
                              color: theme.palette.error.main,
                            },
                          }}
                        />
                      )
                    }
                    label={
                      task.dueDate
                        ? format(new Date(task.dueDate), 'MMM d')
                        : 'Add date'
                    }
                    onClick={handleDateClick}
                    onDelete={task.dueDate ? handleClearDate : undefined}
                    variant="outlined"
                    sx={{
                      borderRadius: '6px',
                      borderColor: task.dueDate ? getDueDateColor() : theme.palette.divider,
                      color: getDueDateColor(),
                      backgroundColor: 'transparent',
                      '& .MuiChip-deleteIcon': {
                        color: 'inherit',
                        '&:hover': {
                          color: `${theme.palette.error.main} !important`,
                        },
                      },
                      '&:hover': {
                        borderColor: task.dueDate ? getDueDateColor() : theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  />
                </Tooltip>

                <Tooltip
                  title={
                    task.dueDate
                      ? `Time: ${format(new Date(task.dueDate), 'h:mm a')}`
                      : 'Set time'
                  }
                  arrow
                >
                  <Chip
                    size="small"
                    icon={<TimeIcon sx={{ fontSize: '0.875rem' }} />}
                    label={
                      task.dueDate
                        ? format(new Date(task.dueDate), 'h:mm a')
                        : 'Add time'
                    }
                    onClick={handleTimeClick}
                    variant="outlined"
                    sx={{
                      borderRadius: '6px',
                      borderColor: task.dueDate ? getDueDateColor() : theme.palette.divider,
                      color: getDueDateColor(),
                      backgroundColor: 'transparent',
                      '&:hover': {
                        borderColor: task.dueDate ? getDueDateColor() : theme.palette.primary.main,
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  />
                </Tooltip>
              </Stack>
              <IconButton
                size="small"
                onClick={onDelete}
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : theme.palette.text.secondary,
                  '&:hover': {
                    color: isDark ? '#f87171' : '#ef4444',
                    backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2',
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Popover
            open={isDatePickerOpen}
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
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '12px',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <DatePicker
              value={task.dueDate ? new Date(task.dueDate) : null}
              onChange={handleDateChange}
              minDate={new Date('2025-01-20T12:43:39+06:30')}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { display: 'none' },
                },
                day: {
                  sx: {
                    '&.Mui-selected': {
                      backgroundColor: colors[task.priority].main,
                      '&:hover': {
                        backgroundColor: colors[task.priority].main,
                      },
                    },
                  },
                },
              }}
            />
          </Popover>

          <Popover
            open={isTimePickerOpen}
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
            sx={{
              '& .MuiPaper-root': {
                borderRadius: '12px',
                boxShadow: theme.shadows[8],
              },
            }}
          >
            <TimePicker
              value={task.dueDate ? new Date(task.dueDate) : null}
              onChange={handleTimeChange}
              ampm={true}
              slotProps={{
                textField: {
                  size: 'small',
                  sx: { display: 'none' },
                },
              }}
            />
          </Popover>
        </LocalizationProvider>

        <Menu
          anchorEl={priorityAnchorEl}
          open={isPriorityMenuOpen}
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
            elevation: 8,
            sx: {
              mt: 1,
              borderRadius: '12px',
              minWidth: 220,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1.5,
                borderRadius: '8px',
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
              selected={task.priority === option.value}
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: `${option.color}15`,
                },
                ...(task.priority === option.value && {
                  backgroundColor: `${option.color}15 !important`,
                }),
              }}
            >
              <ListItemIcon>
                <FlagIcon
                  sx={{
                    color: option.color,
                    transition: 'transform 0.2s',
                    transform: task.priority === option.value ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={option.value}
                secondary={option.description}
                primaryTypographyProps={{
                  sx: {
                    color: option.color,
                    fontWeight: task.priority === option.value ? 600 : 400,
                  },
                }}
                secondaryTypographyProps={{
                  sx: { fontSize: '0.75rem' },
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Paper>
    </Zoom>
  );
};

export default Task;
