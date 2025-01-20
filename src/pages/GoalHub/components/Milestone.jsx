import React from 'react';
import { 
  Paper, 
  IconButton, 
  Typography, 
  Stack, 
  Box,
  Chip,
  Button,
  Tooltip,
  InputBase,
  ClickAwayListener,
  Fade,
  LinearProgress,
  Collapse,
  Badge
} from '@mui/material';
import { 
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowRight as ArrowRightIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';
import { Droppable } from 'react-beautiful-dnd';
import { format, isAfter, isBefore, isToday } from 'date-fns';
import Task from './Task';

const priorityColors = {
  High: {
    main: '#ef4444',
    light: '#fee2e2',
    border: '#fecaca',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
  },
  Medium: {
    main: '#f59e0b',
    light: '#fef3c7',
    border: '#fde68a',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  },
  Low: {
    main: '#10b981',
    light: '#d1fae5',
    border: '#a7f3d0',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
  }
};

const Milestone = ({ 
  milestone,
  tasks,
  onToggleComplete,
  onDelete,
  onEdit,
  onAddTask,
  onTaskToggleComplete,
  onTaskDelete,
  onTaskEdit,
  isEditing,
  editValue,
  onEditChange,
  onEditComplete,
  editingTaskId,
  taskEditValue,
  onTaskEditChange,
  onTaskEditComplete
}) => {
  const [expanded, setExpanded] = React.useState(true);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const getDueDateStatus = () => {
    if (!milestone.dueDate) return null;
    const dueDate = new Date(milestone.dueDate);
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

  return (
    <Fade in>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: '16px',
          transition: 'all 0.3s ease-in-out',
          background: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          }
        }}
      >
        {/* Progress bar */}
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: '4px',
            backgroundColor: 'rgba(0,0,0,0.04)',
            '& .MuiLinearProgress-bar': {
              background: priorityColors[milestone.priority].gradient,
            }
          }}
        />

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <IconButton
              size="small"
              onClick={() => onToggleComplete(milestone.id)}
              sx={{ 
                mr: 2,
                color: milestone.completed ? priorityColors[milestone.priority].main : 'action.disabled',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: priorityColors[milestone.priority].main
                }
              }}
            >
              {milestone.completed ? 
                <CheckCircleIcon /> : 
                <UncheckedIcon />
              }
            </IconButton>
            
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{ 
                    mr: 1,
                    transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                    transition: 'transform 0.2s'
                  }}
                >
                  <ArrowDownIcon />
                </IconButton>

                {isEditing ? (
                  <ClickAwayListener onClickAway={onEditComplete}>
                    <InputBase
                      fullWidth
                      value={editValue}
                      onChange={(e) => onEditChange(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && onEditComplete()}
                      sx={{
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        '& input': {
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(0,0,0,0.04)',
                          transition: 'all 0.2s',
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
                    variant="h6"
                    onClick={() => onEdit('title', milestone.title)}
                    sx={{
                      cursor: 'text',
                      p: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      color: milestone.completed ? 'text.secondary' : 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      }
                    }}
                  >
                    {milestone.title}
                  </Typography>
                )}

                <Badge 
                  badgeContent={totalTasks} 
                  color={milestone.completed ? "default" : "primary"}
                  sx={{ ml: 2 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {completedTasks} completed
                  </Typography>
                </Badge>
              </Box>
              
              <Typography
                onClick={() => onEdit('description', milestone.description)}
                sx={{
                  cursor: 'text',
                  p: '8px 12px',
                  ml: 5,
                  borderRadius: '8px',
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  }
                }}
              >
                {milestone.description || 'Add description...'}
              </Typography>
              
              <Stack direction="row" spacing={1.5} sx={{ mt: 2, ml: 5 }}>
                <Tooltip 
                  title={milestone.dueDate ? format(new Date(milestone.dueDate), 'MMMM d, yyyy') : 'Set due date'}
                  arrow
                >
                  <Chip
                    icon={<CalendarIcon sx={{ fontSize: '1.1rem' }} />}
                    label={milestone.dueDate ? format(new Date(milestone.dueDate), 'MMM d') : 'Add date'}
                    onClick={() => onEdit('dueDate', milestone.dueDate)}
                    variant="outlined"
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: getDueDateColor(),
                      color: getDueDateColor(),
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      }
                    }}
                  />
                </Tooltip>

                <Tooltip title={`Priority: ${milestone.priority}`} arrow>
                  <Chip
                    icon={<FlagIcon sx={{ fontSize: '1.1rem', color: priorityColors[milestone.priority].main }} />}
                    label={milestone.priority}
                    onClick={() => onEdit('priority', milestone.priority)}
                    sx={{ 
                      borderRadius: '8px',
                      borderColor: priorityColors[milestone.priority].border,
                      color: priorityColors[milestone.priority].main,
                      backgroundColor: priorityColors[milestone.priority].light,
                      '&:hover': {
                        backgroundColor: priorityColors[milestone.priority].light,
                        opacity: 0.8
                      }
                    }}
                  />
                </Tooltip>

                <Tooltip title="Delete milestone" arrow>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(milestone.id)}
                    sx={{
                      opacity: 0.6,
                      transition: 'all 0.2s',
                      '&:hover': {
                        opacity: 1,
                        color: '#ef4444',
                        backgroundColor: '#fee2e2'
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </Box>

          <Collapse in={expanded}>
            <Box sx={{ ml: 7, mt: 3 }}>
              <Droppable droppableId={`milestone-${milestone.id}`}>
                {(provided) => (
                  <Stack
                    spacing={1.5}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks.map((task, index) => (
                      <Task
                        key={task.id}
                        task={task}
                        provided={provided}
                        onToggleComplete={onTaskToggleComplete}
                        onDelete={onTaskDelete}
                        onEdit={(field, value) => onTaskEdit(task.id, field, value)}
                        isEditing={editingTaskId === task.id}
                        editValue={taskEditValue}
                        onEditChange={onTaskEditChange}
                        onEditComplete={onTaskEditComplete}
                      />
                    ))}
                    {provided.placeholder}
                    
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => onAddTask(milestone.id)}
                      sx={{
                        justifyContent: 'flex-start',
                        color: 'text.secondary',
                        borderRadius: '10px',
                        p: 1.5,
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)',
                        }
                      }}
                    >
                      Add task
                    </Button>
                  </Stack>
                )}
              </Droppable>
            </Box>
          </Collapse>
        </Box>
      </Paper>
    </Fade>
  );
};

export default Milestone;
