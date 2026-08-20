import React from 'react';
import styles from './Button.module.css';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  ...props 
}) => {
  const baseClass = `${styles.btn} ${styles[`btn--${variant}`]} ${styles[`btn--${size}`]} ${className}`;
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={baseClass}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
