import React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import { Pizza, ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';

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
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    const success = await registerAction(data);
    if (success) {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } else {
      const errorMsg = useAuthStore.getState().error || 'Registration failed. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <SEO title="Register" />
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-rose-700 z-0" />
        <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <div className="relative z-10 flex flex-col justify-center items-start p-16 max-w-lg">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Pizza className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-heading text-white tracking-tight">PIZZARO</span>
          </Link>
          <h1 className="text-4xl font-extrabold font-heading text-white mb-6 leading-tight">
            Join the pizza revolution
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your account today and unlock the full power of the Pizzaro pizza builder, exclusive deals, and real-time tracking.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors lg:hidden">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold font-heading mb-2">Create account</h2>
            <p className="text-muted-foreground">Join Pizzaro and start crafting your perfect pizza</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <Input 
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              {...register('name')}
              error={errors.name?.message}
            />
            
            <Input 
              id="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
            
            <Input 
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            
            <Input 
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />
            
            <div className="pt-2">
              <Button type="submit" fullWidth isLoading={isLoading} className="h-12 rounded-xl text-base shadow-lg shadow-primary/20">
                Create Account
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-8 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
