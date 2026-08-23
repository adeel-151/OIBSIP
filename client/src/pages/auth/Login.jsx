import React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import { ArrowLeft } from 'lucide-react';
import SEO from '../../components/SEO';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const HERO_PIZZA = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';
  
  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const success = await login(data);
    if (success) {
      toast.success('Logged in successfully!');
      navigate(redirectTo);
    } else {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#FFF6EA]">
      <SEO title="Login | Pizzaro" />
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1C1A1A] items-center justify-center">
        {/* Background decorations */}
        <div className="absolute top-10 right-20 opacity-30 text-[#FFC700]">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.2 15.3 14.7 20 11 20Z"/>
            <path d="M11 20c2.2 0 4-1.8 4-4L9.5 9.5"/>
          </svg>
        </div>
        <div className="absolute top-40 right-1/2 opacity-20">
          <div className="w-16 h-16 bg-[#FFC700] rounded-full blur-xl"></div>
        </div>
        
        <div className="absolute inset-0 bg-[#FFC700] rounded-full blur-3xl opacity-10 scale-75"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center p-12">
          <Link to="/" className="mb-8">
            <h1 className="font-['Chewy'] text-5xl md:text-6xl text-[#FFC700] tracking-wide drop-shadow-md hover:scale-105 transition-transform">
              PIZZARO
            </h1>
          </Link>
          <img 
            src={HERO_PIZZA} 
            alt="Wood-fired Pizza" 
            className="w-[80%] max-w-[450px] object-cover rounded-full shadow-2xl ring-8 ring-[#2A2828] transform -rotate-3 mb-8"
          />
          <h2 className="text-3xl font-['Chewy'] text-white tracking-wide mb-4">
            Welcome Back!
          </h2>
          <p className="text-gray-300 max-w-md text-lg leading-relaxed">
            Log in to continue your delicious journey. Build custom pizzas, track your orders, and enjoy exclusive deals.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-[#FFF6EA]">
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
            <h2 className="text-4xl font-['Chewy'] text-[#1C1A1A] mb-2 tracking-wide">Sign In</h2>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1 text-[#1C1A1A]">
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
            
            <div className="space-y-1 text-[#1C1A1A]">
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
            
            <div className="pt-4">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading} 
                className="h-14 rounded-full text-lg font-bold bg-[#FFC700] hover:bg-[#EBB336] text-[#1C1A1A] shadow-lg shadow-[#FFC700]/30 border-none transition-transform hover:scale-[1.02]"
              >
                Sign In
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-8 text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#e53935] font-bold hover:text-red-700 transition-colors">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
