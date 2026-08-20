import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  return (
    <div className={`${styles.inputGroup} ${className}`}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error.message || error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
