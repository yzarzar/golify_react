import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, variant = 'primary', onClick, disabled = false }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default Button;
