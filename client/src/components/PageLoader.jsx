import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center">
      <div className="relative flex flex-col items-center">
        
        {/* Glowing Background Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-primary/20 blur-3xl rounded-full w-48 h-48 -z-10"
        />

        {/* Cinematic Circular Loader */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          {/* Outer Ring */}
          <motion.svg
            className="absolute inset-0 w-full h-full text-border"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </motion.svg>
          
          {/* Animated Progress Ring */}
          <motion.svg
            className="absolute inset-0 w-full h-full text-primary drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]"
            viewBox="0 0 100 100"
            initial={{ rotate: -90 }}
            animate={{ rotate: 270 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="283"
              initial={{ strokeDashoffset: 283 }}
              animate={{ 
                strokeDashoffset: [283, 70, 283],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </motion.svg>

          {/* Center Icon */}
          <motion.div
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-primary"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/><path d="M5.71 17.11a17.04 17.04 0 0 1 11.4-11.4"/>
            </svg>
          </motion.div>
        </div>

        {/* Animated Text */}
        <div className="flex space-x-1">
          {['P', 'I', 'Z', 'Z', 'A', 'R', 'O'].map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.15,
              }}
              className="text-2xl font-['Chewy'] tracking-widest text-foreground"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="text-sm font-medium tracking-widest text-muted-foreground mt-3 uppercase"
        >
          Crafting Perfection
        </motion.p>
      </div>
    </div>
  );
};

export default PageLoader;
