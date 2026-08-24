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

const HERO_PIZZA = 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=1600&auto=format&fit=crop';

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
    <div className="min-h-screen flex font-sans bg-background relative overflow-hidden">
      <SEO title="Login | Pizzaro" />
      
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        
        {/* Floating Brand Logo */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12">
           <Link to="/" className="font-['Chewy'] text-4xl text-primary tracking-wide hover:scale-105 transition-transform inline-block">
             PIZZARO
           </Link>
        </div>
        
        <motion.div 
          className="w-full max-w-md mt-10 md:mt-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-10">
            <h2 className="text-5xl font-['Chewy'] text-foreground mb-3 tracking-wide">Welcome Back</h2>
            <p className="text-muted-foreground text-lg font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1 text-foreground">
              <Input 
                id="email"
                label="Email Address"
                type="email"
                placeholder="pizza.lover@example.com"
                className="bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
            
            <div className="space-y-1 text-foreground">
              <Input 
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                className="bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            
            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading} 
                className="h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(225,29,72,0.4)] border-none"
              >
                Sign In
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-10 text-muted-foreground font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-4">
              Create one now
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Immersive Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-zinc-950">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_PIZZA} 
            alt="Wood-fired Pizza" 
            className="w-full h-full object-cover object-center opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          />
        </motion.div>
        
        {/* Gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent w-32"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
        
        <div className="absolute bottom-20 left-16 right-16">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
          >
             <h2 className="text-5xl font-['Chewy'] tracking-wide mb-6 text-white leading-tight">
               "The most authentic crust I've ever tasted outside of Naples."
             </h2>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 text-primary font-bold text-xl">
                 JD
               </div>
               <div>
                 <p className="text-white font-bold text-lg">John Doe</p>
                 <p className="text-white/60 font-medium">Food Critic</p>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
