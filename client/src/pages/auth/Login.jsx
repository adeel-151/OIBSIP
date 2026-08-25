import React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import { ArrowLeft, Pizza } from 'lucide-react';
import SEO from '../../components/SEO';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const HERO_PIZZA = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1600&auto=format&fit=crop';

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(loginSchema)
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
    <div className="min-h-screen flex font-sans bg-background relative overflow-hidden">
      <SEO title="Login | Pizzaro" />
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        
        <motion.div
          className="w-full max-w-md flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          
          {/* Header Row - Back Button & Logo */}
          <div className="flex justify-between items-center mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
              <ArrowLeft className="w-5 h-5" /> Back
            </Link>
            
            <Link to="/" className="font-['Chewy'] text-3xl text-primary tracking-wide hover:scale-105 transition-transform flex items-center gap-2">
              <Pizza className="w-8 h-8" /> PIZZARO
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-5xl font-['Chewy'] text-foreground mb-3 tracking-wide">Welcome Back!</h2>
            <p className="text-muted-foreground text-lg font-bold">Sign in to track your delicious orders.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1 text-foreground font-bold">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="pizza.lover@example.com"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('email')}
                error={errors.email?.message} />
              
            </div>
            
            <div className="space-y-1 text-foreground font-bold">
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('password')}
                error={errors.password?.message} />
              
            </div>
            
            <div className="pt-6">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="h-14 rounded-2xl text-xl font-['Chewy'] tracking-wide bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(225,29,72,0.4)] border-none">
                
                Sign In
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-10 text-muted-foreground font-bold text-lg">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-black hover:text-primary/80 transition-colors underline underline-offset-4 decoration-2">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Bright Image for Website Style */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-orange-50">
        {/* Background decorations matching the website theme */}
        <div className="absolute top-10 right-20 opacity-20 text-primary z-10 pointer-events-none">
          <Pizza size={120} className="transform rotate-12" />
        </div>
        <div className="absolute bottom-20 left-10 opacity-20 text-yellow-500 z-10 pointer-events-none">
          <Pizza size={80} className="transform -rotate-45" />
        </div>
        
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0">
          
          <img
            src={HERO_PIZZA}
            alt="Delicious Pizza Slice"
            className="w-full h-full object-cover object-center drop-shadow-2xl brightness-110" />
          
        </motion.div>
        
        {/* Vibrant Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-32 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent mix-blend-multiply"></div>
        
        <div className="absolute bottom-16 left-16 right-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-background/90 backdrop-blur-md p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            
             <h2 className="text-4xl font-['Chewy'] tracking-wide mb-2 text-foreground">
               "Warning: May cause intense pizza cravings!"
             </h2>
             <p className="text-primary font-bold text-xl">
               — Happy Customer
             </p>
          </motion.div>
        </div>
      </div>
    </div>);

};

export default Login;