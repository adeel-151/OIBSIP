import React from 'react';
import { Input as ShadcnInput } from './input.tsx';

const Input = React.forwardRef(({ 
  label, 
  error, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full mb-4 ${className}`}>
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <ShadcnInput 
        ref={ref}
        className={`${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
        {...props} 
      />
      {error && <span className="text-xs text-destructive mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
