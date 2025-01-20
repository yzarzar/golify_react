import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const TimeOverview = ({ nextDueDate }) => {
  const { darkMode } = useTheme();

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
            Next Deadline
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DateRangeIcon sx={{ 
              color: darkMode ? '#ef5350' : '#d32f2f'
            }} />
            <Typography variant="h6" fontWeight="500" sx={{
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'inherit'
            }}>
              {nextDueDate?.toLocaleDateString('en-US', { 
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
  );
};

export default TimeOverview;
