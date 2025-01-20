import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  keyframes,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Share as ShareIcon,
  EmojiEvents as TrophyIcon,
  CheckCircle as CheckCircleIcon,
  PauseCircle as PauseCircleIcon,
  Cancel as CancelIcon,
  LowPriority as LowPriorityIcon,
  PriorityHigh as HighPriorityIcon,
  Timer as TimerIcon,
  Timelapse as TimelapseIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const formatDuration = (days) => {
  if (days < 0) return '0 days';
  if (days < 30) return `${days} day${days === 1 ? '' : 's'}`;
  
  const years = Math.floor(days / 365);
  const remainingDays = days % 365;
  const months = Math.floor(remainingDays / 30);
  const lastDays = remainingDays % 30;

  if (years > 0) {
    let result = `${years} year${years === 1 ? '' : 's'}`;
    if (months > 0) {
      result += ` ${months} month${months === 1 ? '' : 's'}`;
    }
    return result;
  }

  if (months > 0) {
    if (lastDays === 0) return `${months} month${months === 1 ? '' : 's'}`;
    return `${months} month${months === 1 ? '' : 's'} ${lastDays} day${lastDays === 1 ? '' : 's'}`;
  }

  return `${days} day${days === 1 ? '' : 's'}`;
};

const calculateTimeMetrics = (startDate, endDate) => {
  const now = new Date();
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;
  
  if (!start && !end) return { label: 'No timeline set' };
  
  const totalDays = start && end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : null;
  const remainingDays = end ? Math.ceil((end - now) / (1000 * 60 * 60 * 24)) : null;
  const progressDays = start ? Math.ceil((now - start) / (1000 * 60 * 60 * 24)) : null;
  
  let status = '';
  let color = '';
  
  if (end) {
    if (remainingDays < 0) {
      status = 'overdue';
      color = 'error';
    } else if (remainingDays <= 7) {
      status = 'due soon';
      color = 'warning';
    } else {
      status = 'on track';
      color = 'success';
    }
  }

  let timelineLabel = '';
  if (start && end) {
    if (remainingDays < 0) {
      timelineLabel = `${formatDuration(totalDays)} duration • Overdue by ${formatDuration(Math.abs(remainingDays))}`;
    } else {
      timelineLabel = `${formatDuration(totalDays)} duration • ${formatDuration(remainingDays)} remaining`;
    }
  } else if (start) {
    timelineLabel = `Started ${formatDuration(progressDays)} ago`;
  } else if (end) {
    if (remainingDays < 0) {
      timelineLabel = `Overdue by ${formatDuration(Math.abs(remainingDays))}`;
    } else {
      timelineLabel = `Due in ${formatDuration(remainingDays)}`;
    }
  }

  return {
    label: timelineLabel,
    status,
    color,
    remainingDays,
    totalDays,
    progressDays
  };
};

const getDateRangeLabel = (startDate, endDate) => {
  if (!startDate && !endDate) return 'No date set';
  if (!startDate) return `Due by ${formatDate(endDate)}`;
  if (!endDate) return `Started on ${formatDate(startDate)}`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

const rotateAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const AnimatedIcon = ({ icon: Icon, animation, color }) => (
  <Box
    component="span"
    sx={{
      display: 'inline-flex',
      animation: `${animation} ${animation === rotateAnimation ? '10s' : '2s'} infinite linear`,
      color: color
    }}
  >
    <Icon sx={{ fontSize: 18 }} />
  </Box>
);

const GoalHeader = ({ goal }) => {
  const { darkMode } = useTheme();

  // Status configuration
  const statusConfig = {
    completed: {
      icon: CheckCircleIcon,
      label: 'Completed',
      color: '#4caf50',
      bgColor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
    },
    in_progress: {
      icon: SpeedIcon,
      label: 'In Progress',
      color: '#f57c00',
      bgColor: darkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.05)',
    },
    paused: {
      icon: PauseCircleIcon,
      label: 'Paused',
      color: '#9e9e9e',
      bgColor: darkMode ? 'rgba(158, 158, 158, 0.1)' : 'rgba(158, 158, 158, 0.05)',
    },
    cancelled: {
      icon: CancelIcon,
      label: 'Cancelled',
      color: '#f44336',
      bgColor: darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
    },
  };

  // Priority configuration
  const priorityConfig = {
    high: {
      icon: HighPriorityIcon,
      label: 'High Priority',
      color: '#d32f2f',
      bgColor: darkMode ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
    },
    medium: {
      icon: FlagIcon,
      label: 'Medium Priority',
      color: '#f57c00',
      bgColor: darkMode ? 'rgba(255, 183, 77, 0.1)' : 'rgba(255, 152, 0, 0.05)',
    },
    low: {
      icon: LowPriorityIcon,
      label: 'Low Priority',
      color: '#2196f3',
      bgColor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
    },
  };

  const status = goal?.status || 'in_progress';
  const priority = goal?.priority?.toLowerCase() || 'medium';

  const StatusIcon = statusConfig[status].icon;
  const PriorityIcon = priorityConfig[priority].icon;

  const timeMetrics = calculateTimeMetrics(goal?.start_date, goal?.end_date);

  const start = goal?.start_date ? new Date(goal?.start_date) : null;
  const end = goal?.end_date ? new Date(goal?.end_date) : null;
  const totalDays = start && end ? Math.ceil((end - start) / (1000 * 60 * 60 * 24)) : null;
  const remainingDays = end ? Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24)) : null;
  const progressDays = start ? Math.ceil((new Date() - start) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Box sx={{ mb: 6 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        mb: 3
      }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrophyIcon sx={{ 
              fontSize: 32,
              color: darkMode ? '#ffd700' : '#ffa000',
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: darkMode ? '#fff' : '#1a237e',
            }}>
              {goal?.title || 'Goal Hub'}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            maxWidth: 600,
            lineHeight: 1.6,
          }}>
            {goal?.description || 'Track your progress, manage tasks, and achieve your goals efficiently. Stay focused and organized with our comprehensive goal tracking system.'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Share">
            <IconButton sx={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              '&:hover': {
                color: darkMode ? '#fff' : 'text.primary',
              }
            }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton sx={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
              '&:hover': {
                color: darkMode ? '#fff' : 'text.primary',
              }
            }}>
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Status Chips */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Chip
          icon={<StatusIcon />}
          label={statusConfig[status].label}
          sx={{
            bgcolor: statusConfig[status].bgColor,
            color: statusConfig[status].color,
            '& .MuiChip-icon': {
              color: statusConfig[status].color,
            }
          }}
        />
        <Chip
          icon={<PriorityIcon />}
          label={priorityConfig[priority].label}
          sx={{
            bgcolor: priorityConfig[priority].bgColor,
            color: priorityConfig[priority].color,
            '& .MuiChip-icon': {
              color: priorityConfig[priority].color,
            }
          }}
        />
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2
          }}>
            {/* Date Range */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DateRangeIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {getDateRangeLabel(goal?.start_date, goal?.end_date)}
              </Typography>
            </Box>

            {/* Duration */}
            {start && end && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
              }}>
                <AnimatedIcon 
                  icon={TimelapseIcon} 
                  animation={rotateAnimation}
                  color={darkMode ? '#81c784' : '#4caf50'}
                />
                <Typography variant="body2">
                  Duration: {formatDuration(totalDays)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Time Remaining */}
          {(start || end) && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary'
            }}>
              {remainingDays < 0 ? (
                <>
                  <AnimatedIcon 
                    icon={WarningIcon} 
                    animation={pulseAnimation}
                    color={darkMode ? '#ef5350' : '#d32f2f'}
                  />
                  <Typography variant="body2" sx={{ color: darkMode ? '#ef5350' : '#d32f2f' }}>
                    Overdue by {formatDuration(Math.abs(remainingDays))}
                  </Typography>
                </>
              ) : end ? (
                <>
                  <AnimatedIcon 
                    icon={UpdateIcon} 
                    animation={rotateAnimation}
                    color={darkMode ? '#ffb74d' : '#f57c00'}
                  />
                  <Typography variant="body2">
                    {remainingDays <= 7 ? (
                      <Box component="span" sx={{ color: darkMode ? '#ffb74d' : '#f57c00' }}>
                        Due soon: {formatDuration(remainingDays)} remaining
                      </Box>
                    ) : (
                      `${formatDuration(remainingDays)} remaining`
                    )}
                  </Typography>
                </>
              ) : (
                <>
                  <AnimatedIcon 
                    icon={TimerIcon} 
                    animation={rotateAnimation}
                    color={darkMode ? '#81c784' : '#4caf50'}
                  />
                  <Typography variant="body2">
                    Started {formatDuration(progressDays)} ago
                  </Typography>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default GoalHeader;
