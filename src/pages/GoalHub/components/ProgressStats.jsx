import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const ProgressStats = ({ icon: Icon, label, stats }) => {
  const { darkMode } = useTheme();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Icon sx={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'text.secondary',
            fontSize: 16 
          }} />
          <Typography variant="body2" sx={{
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'text.secondary'
          }}>
            {label}
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
            {stats.completed} Done
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
            {stats.total}
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
            {stats.inProgress}
          </Typography>
        </Box>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={(stats.completed / stats.total) * 100}
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
  );
};

export default ProgressStats;
