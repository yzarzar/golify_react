import React from 'react';
import { 
  Stack, 
  Typography,
  useTheme,
  Paper,
  Fade,
  Button,
  Box,
  IconButton
} from '@mui/material';
import { 
  EmojiObjects as EmojiObjectsIcon,
  Add as AddIcon,
  TipsAndUpdates as TipsIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import PropTypes from 'prop-types';

const MOTIVATIONAL_TIPS = [
  "Break your goal into smaller, manageable steps",
  "Set realistic deadlines for each milestone",
  "Celebrate small victories along the way",
  "Track your progress regularly",
  "Stay flexible and adjust your plan as needed"
];

const EmptyMilestoneState = ({ 
  onAddClick,
  customMessage,
  showTips = true,
  animate = true 
}) => {
  const theme = useTheme();
  const [showAllTips, setShowAllTips] = React.useState(false);
  const [activeTipIndex, setActiveTipIndex] = React.useState(0);

  React.useEffect(() => {
    if (!showAllTips) {
      const interval = setInterval(() => {
        setActiveTipIndex((prev) => (prev + 1) % MOTIVATIONAL_TIPS.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showAllTips]);

  return (
    <Fade in timeout={1000}>
      <Paper
        elevation={0}
        sx={{ 
          minHeight: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(25,118,210,0.05) 0%, rgba(25,118,210,0) 100%)'
            : 'linear-gradient(180deg, rgba(25,118,210,0.08) 0%, rgba(25,118,210,0) 100%)',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.4,
            pointerEvents: 'none',
            '& .dot': {
              position: 'absolute',
              borderRadius: '50%',
              background: theme.palette.primary.main,
              opacity: 0.1,
            }
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Box
              key={i}
              className="dot"
              sx={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                transform: 'translate(-50%, -50%)',
                animation: animate ? `float ${Math.random() * 10 + 10}s infinite ease-in-out` : 'none',
                '@keyframes float': {
                  '0%, 100%': {
                    transform: 'translate(-50%, -50%) scale(1)',
                  },
                  '50%': {
                    transform: 'translate(-50%, -50%) scale(1.2)',
                  },
                },
              }}
            />
          ))}
        </Box>

        <Stack spacing={3} maxWidth={600} position="relative">
          {/* Icon with glow effect */}
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              alignSelf: 'center',
              mb: 2,
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: theme.palette.primary.main,
                borderRadius: '50%',
                filter: 'blur(20px)',
                opacity: 0.2,
                animation: animate ? 'pulse 2s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 0.2 },
                  '50%': { transform: 'scale(1.3)', opacity: 0.1 },
                  '100%': { transform: 'scale(1)', opacity: 0.2 },
                },
              }
            }}
          >
            <EmojiObjectsIcon 
              sx={{ 
                fontSize: 80,
                color: 'primary.main',
                animation: animate ? 'glow 2s infinite' : 'none',
                '@keyframes glow': {
                  '0%': { filter: 'brightness(1)' },
                  '50%': { filter: 'brightness(1.3)' },
                  '100%': { filter: 'brightness(1)' },
                },
              }} 
            />
          </Box>

          <Typography 
            variant="h4" 
            color="primary" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              letterSpacing: '-0.5px'
            }}
          >
            Ready to Break Down Your Goal?
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.6,
              opacity: 0.9
            }}
          >
            {customMessage || 'Every great achievement starts with small steps. Create milestones to track your progress and stay motivated on your journey to success.'}
          </Typography>

          {showTips && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TipsIcon sx={{ color: 'primary.main', mr: 1, fontSize: '1.2rem' }} />
                <Typography variant="subtitle2" color="primary">
                  Pro Tips
                </Typography>
              </Box>
              
              <Stack spacing={1}>
                {showAllTips ? (
                  MOTIVATIONAL_TIPS.map((tip, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        '&::before': {
                          content: '"•"',
                          color: theme.palette.primary.main,
                          mr: 1
                        }
                      }}
                    >
                      {tip}
                    </Typography>
                  ))
                ) : (
                  <Fade key={activeTipIndex} in timeout={500}>
                    <Typography variant="body2" color="text.secondary">
                      {MOTIVATIONAL_TIPS[activeTipIndex]}
                    </Typography>
                  </Fade>
                )}
              </Stack>

              <IconButton
                size="small"
                onClick={() => setShowAllTips(!showAllTips)}
                sx={{
                  position: 'absolute',
                  bottom: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[1],
                  '&:hover': {
                    backgroundColor: theme.palette.background.paper,
                  }
                }}
              >
                <ArrowDownIcon 
                  sx={{ 
                    transform: showAllTips ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.3s'
                  }} 
                />
              </IconButton>
            </Paper>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={onAddClick}
            startIcon={<AddIcon />}
            sx={{
              mt: 2,
              alignSelf: 'center',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 500,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.2s'
            }}
          >
            Add Your First Milestone
          </Button>
        </Stack>
      </Paper>
    </Fade>
  );
};

EmptyMilestoneState.propTypes = {
  onAddClick: PropTypes.func,
  customMessage: PropTypes.string,
  showTips: PropTypes.bool,
  animate: PropTypes.bool
};

export default EmptyMilestoneState;
