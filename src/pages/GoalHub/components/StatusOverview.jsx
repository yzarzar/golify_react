import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  Star as StarIcon,
  Task as TaskIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';
import ProgressStats from './ProgressStats';

const StatusOverview = ({ goal }) => {
  const { darkMode } = useTheme();

  const taskStats = {
    total: goal?.task_stats?.total || 0,
    completed: goal?.task_stats?.completed || 0,
    inProgress: goal?.task_stats?.in_progress || 0
  };

  const milestoneStats = {
    total: goal?.milestone_stats?.total || 0,
    completed: goal?.milestone_stats?.completed || 0,
    inProgress: goal?.milestone_stats?.in_progress || 0
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
        <ProgressStats
          icon={TaskIcon}
          label="Tasks"
          stats={taskStats}
        />
        <ProgressStats
          icon={TimelineIcon}
          label="Milestones"
          stats={milestoneStats}
        />
      </Stack>
    </Paper>
  );
};

export default StatusOverview;
