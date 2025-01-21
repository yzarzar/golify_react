import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const TimeOverview = ({ goal }) => {
  const { darkMode } = useTheme();

  const calculateTimeRemaining = () => {
    if (!goal?.end_date) return null;
    
    const endDate = new Date(goal.end_date);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    }
    return `${diffDays} days remaining`;
  };

  const getMotivationalMessage = () => {
    if (!goal) return "Set your first goal to get started!";
    
    const progress = goal.progress_percentage || 0;
    if (progress >= 100) {
      return "Congratulations! You've completed this goal! 🎉";
    }
    if (progress >= 75) {
      return "Almost there! Keep pushing to reach your goal!";
    }
    if (progress >= 50) {
      return "Halfway there! Maintain your momentum!";
    }
    if (progress >= 25) {
      return "Great start! Keep up the good work!";
    }
    return "You've begun your journey! Take it one step at a time.";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
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
            Goal Deadline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeIcon sx={{ 
              color: !goal?.end_date ? (darkMode ? '#9e9e9e' : '#757575') :
                     new Date(goal.end_date) < new Date() ? (darkMode ? '#ef5350' : '#d32f2f') :
                     (darkMode ? '#42a5f5' : '#1976d2')
            }} />
            <Typography variant="h6" fontWeight="500" sx={{
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
            }}>
              {formatDate(goal?.end_date)}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary',
            mb: 0.5 
          }}>
            Time Status
          </Typography>
          <Typography variant="h6" fontWeight="500" sx={{
            color: !goal?.end_date ? (darkMode ? '#9e9e9e' : '#757575') :
                   new Date(goal?.end_date) < new Date() ? (darkMode ? '#ef5350' : '#d32f2f') :
                   (darkMode ? '#42a5f5' : '#1976d2')
          }}>
            {calculateTimeRemaining() || "No deadline set"}
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
            {getMotivationalMessage()}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TimeOverview;
