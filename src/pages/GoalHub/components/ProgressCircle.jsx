import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import { useTheme } from '../../../contexts/ThemeContext';

const ProgressCircle = ({ progress }) => {
  const { darkMode } = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
          value={progress}
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
          <Typography
            variant="h3"
            component="div"
            sx={{ 
              fontSize: '2.5rem',  
              fontWeight: 600,
              color: darkMode ? '#fff' : '#1976d2',
              mb: -0.5 
            }}
          >
            {`${Math.round(progress)}%`}
          </Typography>
          <Typography
            variant="caption"
            component="div"
            sx={{
              fontSize: '0.875rem',
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              mt: 1
            }}
          >
            Completed
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressCircle;
