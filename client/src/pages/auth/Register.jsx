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

const HERO_PIZZA = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1600&auto=format&fit=crop';

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
    <div className="min-h-screen flex font-sans bg-background relative overflow-hidden">
      <SEO title="Register | Pizzaro" />
      
      {/* Left Panel - Immersive Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-zinc-950">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={HERO_PIZZA} 
            alt="Wood-fired Pizza Making" 
            className="w-full h-full object-cover object-center opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000"
          />
        </motion.div>
        
        {/* Gradients to blend smoothly */}
        <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent w-32 right-0 left-auto z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent"></div>
        
        <div className="absolute bottom-20 left-16 right-16 z-20">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.6, duration: 0.8 }}
          >
             <h2 className="text-5xl font-['Chewy'] tracking-wide mb-6 text-white leading-tight">
               "Craft your perfect pie, from scratch, exactly how you like it."
             </h2>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/50 text-primary font-bold text-xl">
                 MZ
               </div>
               <div>
                 <p className="text-white font-bold text-lg">Mario Zucchini</p>
                 <p className="text-white/60 font-medium">Head Chef</p>
               </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative z-10">
        
        {/* Floating Brand Logo */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
           <Link to="/" className="font-['Chewy'] text-4xl text-primary tracking-wide hover:scale-105 transition-transform inline-block">
             PIZZARO
           </Link>
        </div>

        <motion.div 
          className="w-full max-w-md mt-10 md:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-10 transition-colors font-semibold">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-10">
            <h2 className="text-5xl font-['Chewy'] text-foreground mb-3 tracking-wide">Join Pizzaro</h2>
            <p className="text-muted-foreground text-lg font-medium">Create your account to start crafting.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-foreground">
              <Input 
                id="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                className="bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>
            
            <div className="text-foreground">
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
            
            <div className="text-foreground">
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
            
            <div className="text-foreground">
              <Input 
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                className="bg-secondary/50 border-transparent focus-visible:ring-primary focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />
            </div>
            
            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                isLoading={isLoading} 
                className="h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(225,29,72,0.4)] border-none"
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-10 text-muted-foreground font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
