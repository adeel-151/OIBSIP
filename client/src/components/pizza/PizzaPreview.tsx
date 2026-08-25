import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PizzaPreview = ({ base, sauce, cheese, vegetables }) => {
  return (
    <div className="relative w-full max-w-[300px] aspect-square mx-auto my-8 perspective-1000">
      <div className="absolute inset-0 rounded-full border-[12px] border-[#e6cca5] bg-[#fff5e6] shadow-[inset_0_0_20px_rgba(0,0,0,0.1),_0_20px_30px_rgba(0,0,0,0.15)] flex items-center justify-center transform rotate-x-12">
        {/* Base Layer */}
        <AnimatePresence>
          {base && (
            <motion.div 
              key="base"
              className="absolute inset-2 rounded-full border-[8px] border-[#d4b08c] bg-[#fae8d4]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-50">{base.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sauce Layer */}
        <AnimatePresence>
          {sauce && (
            <motion.div 
              key="sauce"
              className="absolute inset-6 rounded-full bg-[#E53935]/90 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.9 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-50">{sauce.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cheese Layer */}
        <AnimatePresence>
          {cheese && (
            <motion.div 
              key="cheese"
              className="absolute inset-8 rounded-full bg-[#F5B942]/90 shadow-[0_0_10px_rgba(245,185,66,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-background/80 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-foreground opacity-50">{cheese.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vegetables Layer */}
        <div className="absolute inset-10 rounded-full">
          <AnimatePresence>
            {vegetables.map((veg, index) => (
              <motion.div
                key={veg._id}
                className="absolute w-8 h-8 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  top: `${20 + (index * 25) % 60}%`,
                  left: `${20 + (index * 35) % 60}%`,
                  transform: `rotate(${index * 45}deg)`
                }}
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: index * 45 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: index * 0.05 }}
              >
                <div className="w-5 h-5 rounded-full bg-green-600 shadow-sm border border-green-800" title={veg.name}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!base && !sauce && !cheese && vegetables.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-muted-foreground/60 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><path d="M15 11h.01"/><path d="M11 15h.01"/><path d="M16 16h.01"/><path d="m2 16 20 6-6-20A20 20 0 0 0 2 16"/></svg>
            <p className="text-sm">Select a base to start building</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaPreview;
