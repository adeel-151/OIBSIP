import React from 'react';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import { ArrowLeft, Pizza } from 'lucide-react';
import SEO from '../../components/SEO';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const HERO_PIZZA = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1600&auto=format&fit=crop';

const Register = () => {
  const registerAction = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useReactHookForm({
    resolver: zodResolver(registerSchema)
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
      
      {/* Left Panel - Bright Image for Website Style */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-yellow-50">
        
        {/* Background decorations matching the website theme */}
        <div className="absolute top-20 left-10 opacity-20 text-red-500 z-10 pointer-events-none">
          <Pizza size={100} className="transform -rotate-12" />
        </div>
        
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute inset-0">
          
          <img
            src={HERO_PIZZA}
            alt="Wood-fired Pizza Making"
            className="w-full h-full object-cover object-center drop-shadow-2xl brightness-105" />
          
        </motion.div>
        
        {/* Vibrant Gradient */}
        <div className="absolute inset-0 bg-gradient-to-l from-background via-transparent to-transparent w-32 right-0 left-auto z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/60 via-transparent to-transparent mix-blend-multiply"></div>
        
        <div className="absolute bottom-16 left-16 right-16 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-background/90 backdrop-blur-md p-8 rounded-3xl border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            
             <h2 className="text-4xl font-['Chewy'] tracking-wide mb-2 text-foreground">
               "Craft your perfect pie, from scratch, exactly how you like it."
             </h2>
             <p className="text-primary font-bold text-xl">
               — Mario Zucchini, Head Chef
             </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        
        <motion.div
          className="w-full max-w-md flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}>
          
          {/* Header Row - Logo & Back Button */}
          <div className="flex justify-between items-center mb-12">
            <Link to="/" className="font-['Chewy'] text-3xl text-primary tracking-wide hover:scale-105 transition-transform flex items-center gap-2">
              <Pizza className="w-8 h-8" /> PIZZARO
            </Link>
            
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-bold">
               Back <ArrowLeft className="w-5 h-5 rotate-180" /> 
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-5xl font-['Chewy'] text-foreground mb-3 tracking-wide">Join Pizzaro</h2>
            <p className="text-muted-foreground text-lg font-bold">Create your account to start crafting.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-foreground font-bold">
              <Input
                id="name"
                label="Full Name"
                type="text"
                placeholder="John Doe"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('name')}
                error={errors.name?.message} />
              
            </div>
            
            <div className="text-foreground font-bold">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="pizza.lover@example.com"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('email')}
                error={errors.email?.message} />
              
            </div>
            
            <div className="text-foreground font-bold">
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('password')}
                error={errors.password?.message} />
              
            </div>
            
            <div className="text-foreground font-bold">
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                inputClassName="bg-secondary/40 border-2 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-2xl h-14 px-5 text-base shadow-sm transition-all"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message} />
              
            </div>
            
            <div className="pt-6">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="h-14 rounded-2xl text-xl font-['Chewy'] tracking-wide bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgb(225,29,72,0.4)] border-none">
                
                Create Account
              </Button>
            </div>
          </form>
          
          <p className="text-center mt-10 text-muted-foreground font-bold text-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-black hover:text-primary/80 transition-colors underline underline-offset-4 decoration-2">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>);

};

export default Register;