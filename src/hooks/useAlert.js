import { useState, useCallback } from 'react';

const useAlert = () => {
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const showAlert = useCallback((message, severity = 'success') => {
    setAlert({
      open: true,
      message,
      severity
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  return {
    alert,
    showAlert,
    hideAlert
  };
};

export default useAlert;
