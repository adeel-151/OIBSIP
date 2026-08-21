import React from 'react';
import { Button as ShadcnButton } from './button.tsx';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  className = '', 
  fullWidth = false,
  ...props 
}) => {
  // Map custom variant to shadcn variant
  let shadcnVariant = 'default';
  if (variant === 'secondary') shadcnVariant = 'secondary';
  if (variant === 'premium') shadcnVariant = 'default'; 
  if (variant === 'outline') shadcnVariant = 'outline';
  
  // Size mapping
  let shadcnSize = 'default';
  if (size === 'sm') shadcnSize = 'sm';
  if (size === 'lg') shadcnSize = 'lg';
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.98 }} 
      className={fullWidth ? 'w-full' : 'inline-block'}
    >
      <ShadcnButton
        variant={shadcnVariant}
        size={shadcnSize}
        className={`${fullWidth ? 'w-full' : ''} ${variant === 'premium' ? 'bg-gradient-to-r from-primary to-rose-600 text-white hover:from-primary/90 hover:to-rose-600/90 shadow-xl shadow-primary/30' : ''} ${className}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        ) : null}
        {children}
      </ShadcnButton>
    </motion.div>
  );
};

export default Button;
