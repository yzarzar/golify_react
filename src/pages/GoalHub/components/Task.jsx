import React from 'react';
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
  Zoom
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  DragIndicator as DragIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { format, isAfter, isBefore, isToday } from 'date-fns';

const priorityColors = {
  High: {
    main: '#ef4444',
    light: '#fee2e2',
    border: '#fecaca'
  },
  Medium: {
    main: '#f59e0b',
    light: '#fef3c7',
    border: '#fde68a'
  },
  Low: {
    main: '#10b981',
    light: '#d1fae5',
    border: '#a7f3d0'
  }
};

const Task = ({ 
  task, 
  provided, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  isEditing,
  editValue,
  onEditChange,
  onEditComplete
}) => {
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    
    if (isToday(dueDate)) return 'today';
    if (isBefore(dueDate, today)) return 'overdue';
    if (isAfter(dueDate, today)) return 'upcoming';
    return null;
  };

  const getDueDateColor = () => {
    const status = getDueDateStatus();
    switch (status) {
      case 'overdue':
        return '#ef4444';
      case 'today':
        return '#8b5cf6';
      case 'upcoming':
        return '#10b981';
      default:
        return 'text.secondary';
    }
  };

  const getDueDateIcon = () => {
    const status = getDueDateStatus();
    switch (status) {
      case 'overdue':
        return <TimeIcon sx={{ fontSize: '0.875rem', color: '#ef4444' }} />;
      case 'today':
        return <TimeIcon sx={{ fontSize: '0.875rem', color: '#8b5cf6' }} />;
      default:
        return <CalendarIcon sx={{ fontSize: '0.875rem' }} />;
    }
  };

  return (
    <Zoom in style={{ transitionDelay: '100ms' }}>
      <Paper
        ref={provided.innerRef}
        {...provided.draggableProps}
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1.5,
          borderRadius: '10px',
          backgroundColor: task.completed ? 'rgba(0,0,0,0.02)' : 'white',
          border: '1px solid',
          borderColor: task.completed ? 'divider' : priorityColors[task.priority].border,
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            backgroundColor: task.completed ? 'rgba(0,0,0,0.03)' : priorityColors[task.priority].light,
            '& .task-actions': {
              opacity: 1,
              transform: 'translateX(0)',
            },
            '& .drag-handle': {
              opacity: 0.5,
            }
          }
        }}
      >
        {/* Priority indicator */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            backgroundColor: priorityColors[task.priority].main,
            opacity: task.completed ? 0.3 : 0.8
          }}
        />

        <Box {...provided.dragHandleProps} className="drag-handle" sx={{ 
          opacity: 0,
          transition: 'opacity 0.2s',
          px: 1,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing'
          }
        }}>
          <DragIcon color="action" fontSize="small" />
        </Box>
        
        <IconButton
          size="small"
          onClick={() => onToggleComplete(task.id)}
          sx={{ 
            mr: 1.5,
            color: task.completed ? priorityColors[task.priority].main : 'action.disabled',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'scale(1.1)',
              color: priorityColors[task.priority].main
            }
          }}
        >
          {task.completed ? 
            <CheckCircleIcon /> : 
            <UncheckedIcon />
          }
        </IconButton>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <ClickAwayListener onClickAway={onEditComplete}>
              <InputBase
                fullWidth
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && onEditComplete()}
                sx={{
                  '& input': {
                    padding: '6px 8px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(0,0,0,0.04)',
                    transition: 'all 0.2s',
                    fontSize: '0.95rem',
                    '&:hover, &:focus': {
                      backgroundColor: 'rgba(0,0,0,0.08)',
                    }
                  }
                }}
                autoFocus
              />
            </ClickAwayListener>
          ) : (
            <Typography
              onClick={() => onEdit('title', task.title)}
              sx={{
                cursor: 'text',
                p: '6px 8px',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            >
              {task.title}
            </Typography>
          )}
        </Box>

        <Stack 
          direction="row" 
          spacing={1} 
          className="task-actions"
          sx={{ 
            ml: 2,
            opacity: 0,
            transform: 'translateX(10px)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Tooltip 
            title={task.dueDate ? format(new Date(task.dueDate), 'MMMM d, yyyy') : 'Set due date'}
            arrow
          >
            <Chip
              size="small"
              icon={getDueDateIcon()}
              label={task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'Add date'}
              onClick={() => onEdit('dueDate', task.dueDate)}
              variant="outlined"
              sx={{ 
                borderRadius: '6px',
                borderColor: getDueDateColor(),
                color: getDueDateColor(),
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                }
              }}
            />
          </Tooltip>
          
          <Tooltip title={`Priority: ${task.priority}`} arrow>
            <Chip
              size="small"
              icon={<FlagIcon sx={{ fontSize: '0.875rem', color: priorityColors[task.priority].main }} />}
              label={task.priority}
              onClick={() => onEdit('priority', task.priority)}
              variant="outlined"
              sx={{ 
                borderRadius: '6px',
                borderColor: priorityColors[task.priority].border,
                color: priorityColors[task.priority].main,
                backgroundColor: priorityColors[task.priority].light,
                '&:hover': {
                  backgroundColor: priorityColors[task.priority].light,
                  opacity: 0.8
                }
              }}
            />
          </Tooltip>

          <Tooltip title="Delete task" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(task.id)}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: '#ef4444',
                  backgroundColor: '#fee2e2'
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Paper>
    </Zoom>
  );
};

export default Task;
