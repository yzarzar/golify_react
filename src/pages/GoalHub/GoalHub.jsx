import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Chip,
  Stack,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  Task as TaskIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';

const GoalHub = () => {
  const { darkMode } = useTheme();
  const [milestones, setMilestones] = useState([
    { 
      id: 1, 
      title: 'Research Phase', 
      completed: true,
      dueDate: '2024-02-15',
      expanded: true,
      priority: 'High'
    },
    { 
      id: 2, 
      title: 'Implementation', 
      completed: false,
      dueDate: '2024-03-01',
      expanded: true,
      priority: 'Medium'
    },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Market Research', completed: true, milestoneId: 1, dueDate: '2024-02-10' },
    { id: 2, title: 'Competitor Analysis', completed: true, milestoneId: 1, dueDate: '2024-02-12' },
    { id: 3, title: 'Setup Development Environment', completed: false, milestoneId: 2, dueDate: '2024-02-20' },
    { id: 4, title: 'Create Initial Prototype', completed: false, milestoneId: 2, dueDate: '2024-02-25' },
  ]);

  const getOverallProgress = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const getNextDueDate = () => {
    const allDates = [...tasks, ...milestones]
      .filter(item => !item.completed && item.dueDate)
      .map(item => new Date(item.dueDate));
    
    if (allDates.length === 0) return null;
    return new Date(Math.min(...allDates));
  };

  const getTasksStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  };

  const getMilestoneStats = () => {
    const total = milestones.length;
    const completed = milestones.filter(m => m.completed).length;
    const inProgress = total - completed;
    return { total, completed, inProgress };
  };

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      {/* Goal Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Box>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              color: darkMode ? '#fff' : 'inherit',
              mb: 1 
            }}>
              Goal Hub
            </Typography>
            <Typography variant="body1" sx={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              maxWidth: 600 
            }}>
              Track your progress, manage tasks, and achieve your goals efficiently. Stay focused and organized with our comprehensive goal tracking system.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<SpeedIcon />}
              label="In Progress"
              color="warning"
              size="small"
              sx={{
                bgcolor: darkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                color: darkMode ? '#ffb74d' : '#f57c00',
                '& .MuiChip-icon': {
                  color: darkMode ? '#ffb74d' : '#f57c00',
                }
              }}
            />
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
            }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">
                Due Date: {' '}
                <Box component="span" sx={{ 
                  color: darkMode ? '#ef5350' : '#d32f2f',
                  fontWeight: 500 
                }}>
                  Mar 31, 2024
                </Box>
              </Typography>
            </Box>
            <Chip
              icon={<FlagIcon />}
              label="High Priority"
              color="error"
              size="small"
              sx={{
                bgcolor: darkMode ? 'rgba(239, 83, 80, 0.1)' : 'rgba(211, 47, 47, 0.05)',
                color: darkMode ? '#ef5350' : '#d32f2f',
                '& .MuiChip-icon': {
                  color: darkMode ? '#ef5350' : '#d32f2f',
                }
              }}
            />
            <Chip
              icon={<DateRangeIcon />}
              label="6 Months"
              size="small"
              sx={{
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                '& .MuiChip-icon': {
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
                }
              }}
            />
          </Box>
        </Box>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Main Progress Card */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background Decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 70%)',
                borderRadius: '50%',
                transform: 'translate(30%, -30%)',
              }}
            />

            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={280}
                thickness={4}
                sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.12)' 
                }}
              />
              <CircularProgress
                variant="determinate"
                value={getOverallProgress()}
                size={280}
                thickness={4}
                sx={{
                  color: darkMode ? '#42a5f5' : '#1976d2',
                  position: 'absolute',
                  left: 0,
                  '& .MuiCircularProgress-circle': {
                    strokeLinecap: 'round',
                    transition: 'all 0.5s ease-in-out',
                  },
                }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingUpIcon sx={{ 
                  color: darkMode ? '#42a5f5' : '#1976d2',
                  mb: 1, 
                  fontSize: 44 
                }} />
                <Typography variant="h1" sx={{ 
                  fontWeight: 'bold', 
                  color: darkMode ? '#42a5f5' : '#1976d2',
                  lineHeight: 1 
                }}>
                  {getOverallProgress()}%
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  mt: 1 
                }}>
                  Completed
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Time Overview Card */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5,
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFF',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ 
                color: darkMode ? '#42a5f5' : '#1976d2',
                mr: 1 
              }} />
              <Typography variant="h6" fontWeight="500" sx={{
                color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
              }}>
                Time Overview
              </Typography>
            </Box>

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                  mb: 0.5 
                }}>
                  Next Deadline
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DateRangeIcon sx={{ 
                    color: darkMode ? '#ef5350' : '#d32f2f'
                  }} />
                  <Typography variant="h6" fontWeight="500" sx={{
                    color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
                  }}>
                    {getNextDueDate()?.toLocaleDateString('en-US', { 
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
                  mb: 0.5 
                }}>
                  Time Remaining
                </Typography>
                <Typography variant="h6" fontWeight="500" sx={{
                  color: darkMode ? '#42a5f5' : '#1976d2'
                }}>
                  {Math.ceil((new Date('2024-03-31') - new Date()) / (1000 * 60 * 60 * 24))} Days
                </Typography>
              </Box>

              <Box sx={{ 
                p: 1.5, 
                bgcolor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <EmojiEventsIcon sx={{ 
                  color: darkMode ? '#ffb74d' : '#f57c00',
                  fontSize: 20 
                }} />
                <Typography variant="body2" sx={{
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}>
                  Stay on track! Complete 2 more tasks this week.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Status Overview Card */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2.5,
              bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#F8FAFF',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ 
                color: darkMode ? '#42a5f5' : '#1976d2',
                mr: 1 
              }} />
              <Typography variant="h6" fontWeight="500" sx={{
                color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
              }}>
                Status Overview
              </Typography>
            </Box>

            <Stack spacing={2}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TaskIcon sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
                      fontSize: 16 
                    }} />
                    <Typography variant="body2" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}>
                      Tasks
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ 
                      color: darkMode ? '#66bb6a' : '#2e7d32',
                      fontSize: 14 
                    }} />
                    <Typography variant="body2" sx={{
                      color: darkMode ? '#66bb6a' : '#2e7d32',
                      fontWeight: '500'
                    }}>
                      {getTasksStats().completed} Done
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Box sx={{ 
                    flex: 1, 
                    py: 0.75,
                    px: 1,
                    bgcolor: darkMode ? 'rgba(66, 165, 245, 0.1)' : 'rgba(25, 118, 210, 0.05)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="caption" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
                    }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: darkMode ? '#42a5f5' : '#1976d2',
                      fontWeight: 'bold'
                    }}>
                      {getTasksStats().total}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    flex: 1, 
                    py: 0.75,
                    px: 1,
                    bgcolor: darkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.05)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="caption" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
                    }}>
                      In Progress
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: darkMode ? '#ffb74d' : '#f57c00',
                      fontWeight: 'bold'
                    }}>
                      {getTasksStats().inProgress}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getTasksStats().completed / getTasksStats().total) * 100}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.12)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundImage: darkMode 
                        ? 'linear-gradient(90deg, #42a5f5, #64b5f6)'
                        : 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    }
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimelineIcon sx={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
                      fontSize: 16 
                    }} />
                    <Typography variant="body2" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
                    }}>
                      Milestones
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmojiEventsIcon sx={{ 
                      color: darkMode ? '#66bb6a' : '#2e7d32',
                      fontSize: 14 
                    }} />
                    <Typography variant="body2" sx={{
                      color: darkMode ? '#66bb6a' : '#2e7d32',
                      fontWeight: '500'
                    }}>
                      {getMilestoneStats().completed} Done
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Box sx={{ 
                    flex: 1, 
                    py: 0.75,
                    px: 1,
                    bgcolor: darkMode ? 'rgba(66, 165, 245, 0.1)' : 'rgba(25, 118, 210, 0.05)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="caption" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
                    }}>
                      Total
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: darkMode ? '#42a5f5' : '#1976d2',
                      fontWeight: 'bold'
                    }}>
                      {getMilestoneStats().total}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    flex: 1, 
                    py: 0.75,
                    px: 1,
                    bgcolor: darkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.05)', 
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="caption" sx={{
                      color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
                    }}>
                      In Progress
                    </Typography>
                    <Typography variant="h6" sx={{
                      color: darkMode ? '#ffb74d' : '#f57c00',
                      fontWeight: 'bold'
                    }}>
                      {getMilestoneStats().inProgress}
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(getMilestoneStats().completed / getMilestoneStats().total) * 100}
                  sx={{ 
                    height: 6, 
                    borderRadius: 3,
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(25, 118, 210, 0.12)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      backgroundImage: darkMode 
                        ? 'linear-gradient(90deg, #42a5f5, #64b5f6)'
                        : 'linear-gradient(90deg, #1976d2, #42a5f5)',
                    }
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default GoalHub;