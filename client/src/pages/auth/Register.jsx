import React, { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const registerAction = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerAction(data);
    if (success) {
      toast.success('Registration successful! Please check your email.');
      navigate('/login');
    } else {
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <motion.div 
        className={styles.authCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.authHeader}>
          <h2>Create Account</h2>
          <p>Join Pizzaro and start crafting your way</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
          <Input 
            id="name"
            label="Full Name"
            type="text"
            placeholder="John Doe"
            {...register('name')}
            error={errors.name}
          />
          
          <Input 
            id="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
            error={errors.email}
          />
          
          <Input 
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password}
          />
          
          <Input 
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword}
          />
          
          <Button type="submit" variant="primary" size="full" isLoading={isLoading} style={{ marginTop: '1rem' }}>
            Sign Up
          </Button>
        </form>
        
        <div className={styles.authFooter}>
          <p>Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
