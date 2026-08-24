import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(old => {
        if (old >= 100) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 400); // Show 100% for a brief moment
          }
          return 100;
        }
        return old + Math.floor(Math.random() * 12) + 8;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center"
    >
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

          {/* Center Progress */}
          <motion.div
            className="text-primary font-['Chewy'] text-3xl"
          >
            {progress > 100 ? 100 : progress}%
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
    </motion.div>
  );
};

export default PageLoader;
