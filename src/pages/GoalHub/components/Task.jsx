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
  const [isTitleEditing, setIsTitleEditing] = useState(task.title === '');
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(task.title);
  const [descriptionValue, setDescriptionValue] = useState(task.description || '');
  const [showEditHint, setShowEditHint] = useState(false);
  const [showDescriptionHint, setShowDescriptionHint] = useState(false);
  const [dateAnchorEl, setDateAnchorEl] = useState(null);
  const [timeAnchorEl, setTimeAnchorEl] = useState(null);
  const [priorityAnchorEl, setPriorityAnchorEl] = useState(null);
  
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colors = priorityColors[isDark ? 'dark' : 'light'];

  const handleTitleEditStart = () => {
    setIsTitleEditing(true);
    setTitleValue(task.title);
  };

  const handleTitleChange = (e) => {
    setTitleValue(e.target.value);
  };

  const handleTitleComplete = () => {
    const newTitle = titleValue.trim();
    if (newTitle === '') {
      onDelete();
    } else if (newTitle !== task.title) {
      onEdit({ ...task, title: newTitle });
    }
    setIsTitleEditing(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTitleComplete();
    } else if (e.key === 'Escape') {
      if (task.title === '') {
        onDelete();
      } else {
        setTitleValue(task.title);
        setIsTitleEditing(false);
      }
    }
  };

  const handleDescriptionEditStart = () => {
    setIsDescriptionEditing(true);
    setDescriptionValue(task.description || '');
  };

  const handleDescriptionChange = (e) => {
    setDescriptionValue(e.target.value);
  };

  const handleDescriptionComplete = () => {
    if (descriptionValue.trim() !== task.description) {
      onEdit({ ...task, description: descriptionValue.trim() });
    }
    setIsDescriptionEditing(false);
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionComplete();
    } else if (e.key === 'Escape') {
      setDescriptionValue(task.description || '');
      setIsDescriptionEditing(false);
    }
  };

  const handleDateClick = (event) => {
    setDateAnchorEl(event.currentTarget);
  };

  const handleDateClose = () => {
    setDateAnchorEl(null);
  };

  const handleDateChange = (newDate) => {
    const currentDate = task.dueDate ? new Date(task.dueDate) : new Date();
    const updatedDate = new Date(newDate);
    updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
    onEdit({ ...task, dueDate: updatedDate.toISOString() });
    handleDateClose();
  };

  const handleTimeClick = (event) => {
    setTimeAnchorEl(event.currentTarget);
  };

  const handleTimeClose = () => {
    setTimeAnchorEl(null);
  };

  const handleTimeChange = (newTime) => {
    const [hours, minutes] = newTime.split(':');
    const updatedDate = task.dueDate ? new Date(task.dueDate) : new Date();
    updatedDate.setHours(parseInt(hours), parseInt(minutes));
    onEdit({ ...task, dueDate: updatedDate.toISOString() });
    handleTimeClose();
  };

  const handleClearDate = (event) => {
    event.stopPropagation();
    onEdit({ ...task, dueDate: null });
  };

  const handlePriorityClick = (event) => {
    setPriorityAnchorEl(event.currentTarget);
  };

  const handlePriorityClose = () => {
    setPriorityAnchorEl(null);
  };

  const handlePriorityChange = (newPriority) => {
    onEdit({ ...task, priority: newPriority });
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
    { value: 'High', color: colors.High.main, icon: <FlagIcon /> },
    { value: 'Medium', color: colors.Medium.main, icon: <FlagIcon /> },
    { value: 'Low', color: colors.Low.main, icon: <FlagIcon /> },
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
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: colors[task.priority].gradient,
            opacity: task.completed ? 0.3 : 0.8,
          },
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
        <IconButton
          size="small"
          onClick={onToggleComplete}
          sx={{
            color: task.completed
              ? colors[task.priority].main
              : theme.palette.text.secondary,
            padding: '8px',
            '&:hover': {
              backgroundColor: colors[task.priority].light,
              color: colors[task.priority].main,
            },
          }}
        >
          {task.completed ? (
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
              <ClickAwayListener onClickAway={handleTitleComplete}>
                <InputBase
                  fullWidth
                  value={titleValue}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
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
                  color: task.completed ? theme.palette.text.secondary : theme.palette.text.primary,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: task.completed ? 'line-through' : 'none',
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
            onMouseEnter={() => setShowDescriptionHint(true)}
            onMouseLeave={() => setShowDescriptionHint(false)}
            sx={{ 
              position: 'relative',
              mt: task.description || isDescriptionEditing ? 1.5 : 0.5,
              mb: task.description || isDescriptionEditing ? 1.5 : 0.5,
            }}
          >
            {isDescriptionEditing ? (
              <ClickAwayListener onClickAway={handleDescriptionComplete}>
                <InputBase
                  fullWidth
                  multiline
                  value={descriptionValue}
                  onChange={handleDescriptionChange}
                  onKeyDown={handleDescriptionKeyDown}
                  placeholder="Add a description..."
                  sx={{
                    '& textarea': {
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: theme.palette.action.hover,
                      fontSize: '0.875rem',
                      color: theme.palette.text.primary,
                      lineHeight: 1.6,
                      transition: 'all 0.2s',
                      minHeight: '60px',
                      '&::placeholder': {
                        color: theme.palette.text.secondary,
                        opacity: 0.7,
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                      '&:focus': {
                        backgroundColor: theme.palette.action.selected,
                      }
                    }
                  }}
                  autoFocus
                />
              </ClickAwayListener>
            ) : task.description ? (
              <Box
                onClick={handleDescriptionEditStart}
                sx={{
                  cursor: 'text',
                  position: 'relative',
                  '&:hover': {
                    '& .description-edit-hint': {
                      opacity: 1,
                    }
                  }
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: task.completed
                      ? theme.palette.text.secondary
                      : theme.palette.text.primary,
                    opacity: task.completed ? 0.7 : 0.9,
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
                {showDescriptionHint && (
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
              opacity: task.dueDate || task.priority !== 'Low' ? 1 : 0,
              transform: task.dueDate || task.priority !== 'Low' ? 'none' : 'translateY(10px)',
              transition: 'all 0.2s ease-in-out',
              height: task.dueDate || task.priority !== 'Low' ? 'auto' : 0,
              marginTop: task.description || isDescriptionEditing ? 0 : 1,
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Stack 
              direction="row" 
              spacing={0.5}
              sx={{
                flexGrow: 1,
                minWidth: 0,
                flexWrap: 'wrap',
                gap: 0.5,
              }}
            >
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
                  label={
                    task.dueDate
                      ? format(new Date(task.dueDate), 'MMM d')
                      : 'Add date'
                  }
                  onClick={handleDateClick}
                  onDelete={task.dueDate ? handleClearDate : undefined}
                  variant="outlined"
                  sx={{
                    maxWidth: '120px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    },
                    '& .MuiChip-icon': {
                      ml: 0.75,
                    },
                    borderRadius: '4px',
                    borderColor: task.dueDate ? getDueDateColor() : theme.palette.divider,
                    color: getDueDateColor(),
                    backgroundColor: 'transparent',
                    '&:hover': {
                      borderColor: task.dueDate ? getDueDateColor() : theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>

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
                    value={task.dueDate ? new Date(task.dueDate) : null}
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
                    maxWidth: '110px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    },
                    '& .MuiChip-icon': {
                      ml: 0.75,
                    },
                    borderRadius: '4px',
                    borderColor: task.dueDate ? getDueDateColor() : theme.palette.divider,
                    color: getDueDateColor(),
                    backgroundColor: 'transparent',
                    '&:hover': {
                      borderColor: task.dueDate ? getDueDateColor() : theme.palette.primary.main,
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>

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
                    value={task.dueDate ? new Date(task.dueDate) : null}
                    onChange={(newTime) => {
                      if (newTime) {
                        const timeString = format(newTime, 'HH:mm');
                        handleTimeChange(timeString);
                      }
                    }}
                    slotProps={{
                      textField: {
                        size: 'small',
                        sx: { m: 1, minWidth: 120 },
                      },
                    }}
                  />
                </LocalizationProvider>
              </Popover>

              <Tooltip title={`Priority: ${task.priority}`} arrow>
                <Chip
                  size="small"
                  icon={
                    <FlagIcon
                      sx={{
                        fontSize: '0.875rem',
                        color: colors[task.priority].main,
                      }}
                    />
                  }
                  label={task.priority}
                  onClick={handlePriorityClick}
                  variant="outlined"
                  sx={{
                    maxWidth: '100px',
                    height: '24px',
                    '& .MuiChip-label': {
                      px: 1,
                      fontSize: '0.75rem',
                    },
                    '& .MuiChip-icon': {
                      ml: 0.75,
                    },
                    borderRadius: '4px',
                    backgroundColor: colors[task.priority].light,
                    borderColor: colors[task.priority].border,
                    color: colors[task.priority].main,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: colors[task.priority].light,
                      opacity: 0.9,
                      transform: 'translateY(-1px)',
                      cursor: 'pointer',
                    },
                  }}
                />
              </Tooltip>
            </Stack>

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
                  onClick={() => handlePriorityChange(option.value)}
                  selected={task.priority === option.value}
                  sx={{
                    '&:hover': {
                      backgroundColor: `${colors[option.value].light}`,
                    },
                    ...(task.priority === option.value && {
                      backgroundColor: `${colors[option.value].light} !important`,
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: colors[option.value].main,
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
                        color: colors[option.value].main,
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
