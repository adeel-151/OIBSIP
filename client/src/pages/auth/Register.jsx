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
import { ArrowLeft } from 'lucide-react';
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

const FEATURED_PIZZA = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop';

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
    <div className="min-h-screen flex font-sans bg-[#FFF6EA]">
      <SEO title="Register | Pizzaro" />
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#FFF6EA] order-2 lg:order-1">
        <motion.div 
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-orange-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-8">
            <h2 className="text-4xl font-['Chewy'] text-[#1C1A1A] mb-2 tracking-wide">Create Account</h2>
            <p className="text-gray-500">Join Pizzaro and start crafting your perfect pizza</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
            <div className="text-[#1C1A1A]">
              <Input 
                id="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#FFC700] focus-visible:border-[#FFC700]"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            
            <div className="text-[#1C1A1A]">
              <Input 
                id="email"
                label="Email Address"
                type="email"
                placeholder="pizza.lover@example.com"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#FFC700] focus-visible:border-[#FFC700]"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            
            <div className="text-[#1C1A1A]">
              <Input 
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#FFC700] focus-visible:border-[#FFC700]"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            
            <div className="text-[#1C1A1A]">
              <Input 
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border-gray-200 focus-visible:ring-[#FFC700] focus-visible:border-[#FFC700]"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>
            
            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading} 
                className="h-14 rounded-full text-lg font-bold bg-[#FFC700] hover:bg-[#EBB336] text-[#1C1A1A] shadow-lg shadow-[#FFC700]/30 border-none transition-transform hover:scale-[1.02]"
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-8 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#e53935] font-bold hover:text-red-700 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1C1A1A] items-center justify-center order-1 lg:order-2">
        {/* Background decorations */}
        <div className="absolute top-20 left-10 opacity-30 text-[#e53935]">
           <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-20 h-20"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        
        <div className="absolute inset-0 bg-[#e53935] rounded-full blur-3xl opacity-10 scale-90 translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center p-12">
          <Link to="/" className="mb-8">
            <h1 className="font-['Chewy'] text-5xl md:text-6xl text-[#FFC700] tracking-wide drop-shadow-md hover:scale-105 transition-transform">
              PIZZARO
            </h1>
          </Link>
          <img 
            src={FEATURED_PIZZA} 
            alt="Delicious Pizza" 
            className="w-[80%] max-w-[450px] object-cover rounded-[3rem] shadow-2xl ring-8 ring-white transform rotate-3 mb-8"
          />
          <h2 className="text-3xl font-['Chewy'] text-white tracking-wide mb-4">
            Join the Pizza Revolution
          </h2>
          <p className="text-gray-300 max-w-md text-lg leading-relaxed">
            Create your account today and unlock the full power of the Pizzaro pizza builder, exclusive deals, and fast delivery.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
