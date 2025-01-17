const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] ${level}: ${message}`;
};

const saveToFile = (level, message) => {
  // In production, implement file saving logic here
  if (process.env.NODE_ENV === 'production') {
    // File saving logic would go here
    // For now, we'll just console log
    console.log(`Would save to file: ${formatMessage(level, message)}`);
  }
};

export const logger = {
  info: (message) => {
    const formattedMessage = formatMessage(LOG_LEVELS.INFO, message);
    console.log(formattedMessage);
    saveToFile(LOG_LEVELS.INFO, message);
  },
  warn: (message) => {
    const formattedMessage = formatMessage(LOG_LEVELS.WARN, message);
    console.warn(formattedMessage);
    saveToFile(LOG_LEVELS.WARN, message);
  },
  error: (message, error = null) => {
    const formattedMessage = formatMessage(LOG_LEVELS.ERROR, message);
    console.error(formattedMessage);
    if (error) {
      console.error(error);
    }
    saveToFile(LOG_LEVELS.ERROR, message);
  },
  debug: (message) => {
    if (process.env.NODE_ENV !== 'production') {
      const formattedMessage = formatMessage(LOG_LEVELS.DEBUG, message);
      console.debug(formattedMessage);
    }
  }
};
