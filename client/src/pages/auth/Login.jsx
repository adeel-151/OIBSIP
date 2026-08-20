import React, { useState } from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import styles from './Auth.module.css'; // Let's use a shared Auth module
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const authError = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      toast.success('Logged in successfully!');
      navigate('/');
    } else {
      toast.error('Login failed. Please check your credentials.');
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
          <h2>Welcome Back</h2>
          <p>Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
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
          
          <div className={styles.forgotPassword}>
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          
          <Button type="submit" variant="primary" size="full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>
        
        <div className={styles.authFooter}>
          <p>Don't have an account? <Link to="/register">Sign up</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
