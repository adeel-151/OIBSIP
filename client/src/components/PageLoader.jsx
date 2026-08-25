import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PageLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((old) => {
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
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Ambience */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full w-[60vw] h-[60vw] -z-10" />
      
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-md px-8">
        
        {/* Brand Name / Logo */}
        <div className="flex space-x-2 mb-10 overflow-hidden">
          {['P', 'I', 'Z', 'Z', 'A', 'R', 'O'].map((letter, i) =>
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              ease: [0.16, 1, 0.3, 1] // Custom easeOut bezier
            }}
            className="text-4xl md:text-5xl font-['Chewy'] tracking-widest text-foreground">
            
              {letter}
            </motion.span>
          )}
        </div>
        
        {/* Horizontal Loader Track */}
        <div className="w-full relative h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden mb-6 shadow-inner">
          <motion.div
            className="absolute top-0 left-0 bottom-0 bg-primary shadow-[0_0_15px_rgba(225,29,72,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }} />
          
        </div>
        
        {/* Progress Percentage & Text */}
        <div className="flex justify-between items-center w-full px-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-sm md:text-base font-bold tracking-[0.2em] text-muted-foreground uppercase">
            
            Baking Experience
          </motion.p>
          
          <motion.div
            className="text-lg md:text-xl font-black font-mono text-primary flex items-center justify-end min-w-[3rem]">
            
            {progress > 100 ? 100 : progress}%
          </motion.div>
        </div>
        
      </div>
    </motion.div>);

};

export default PageLoader;