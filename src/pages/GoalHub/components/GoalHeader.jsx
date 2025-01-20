import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  DateRange as DateRangeIcon,
  Flag as FlagIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const GoalHeader = () => {
  const { darkMode } = useTheme();

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
          <Typography variant="h4" sx={{ 
            fontWeight: 700,
            color: darkMode ? '#fff' : '#1a237e',
            mb: 1,
          }}>
            Goal Hub
          </Typography>
          <Typography variant="body1" sx={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary',
            maxWidth: 600,
            lineHeight: 1.6,
          }}>
            Track your progress, manage tasks, and achieve your goals efficiently. Stay focused and organized with our comprehensive goal tracking system.
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
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Chip
          icon={<SpeedIcon />}
          label="In Progress"
          color="warning"
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
          <AccessTimeIcon sx={{ fontSize: 18 }} />
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
  );
};

export default GoalHeader;
