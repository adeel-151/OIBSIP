import React from 'react';
import { Button as ShadcnButton } from './button';
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
        className={`${fullWidth ? 'w-full' : ''} ${variant === 'premium' ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''} ${className}`}
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
