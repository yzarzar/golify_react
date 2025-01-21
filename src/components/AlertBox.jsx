import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AlertBox = ({ 
  open, 
  message, 
  severity = 'success', 
  onClose,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' }
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          whiteSpace: 'pre-line', // Allows line breaks in messages
          '& .MuiAlert-message': {
            maxWidth: '300px', // Prevents very long messages from stretching the alert
            overflowWrap: 'break-word'
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AlertBox;
