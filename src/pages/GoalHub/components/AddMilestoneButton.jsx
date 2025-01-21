import React from 'react';
import { 
  Fab, 
  Zoom,
  Tooltip 
} from '@mui/material';
import { 
  Add as AddIcon 
} from '@mui/icons-material';

const AddMilestoneButton = ({ onClick }) => {
  return (
    <Zoom in>
      <Tooltip 
        title="Add a new milestone to track your progress"
        placement="left"
        arrow
      >
        <Fab
          color="primary"
          aria-label="add milestone"
          onClick={onClick}
          sx={{
            position: "fixed",
            right: { xs: 16, sm: 24, md: 40 },
            bottom: { xs: 16, sm: 24, md: 40 },
            width: 64,
            height: 64,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
            },
            transition: "all 0.2s ease-in-out",
            "& .MuiSvgIcon-root": {
              fontSize: 28,
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Zoom>
  );
};

export default AddMilestoneButton;
