import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Star, Flame } from 'lucide-react';

const PizzaCard = ({ pizza, onCustomize, onQuickAdd }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-[2rem] overflow-hidden border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:shadow-[12px_12px_0px_0px_hsl(var(--foreground))] transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-background border-b-4 border-foreground">
        <img 
          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'} 
          alt={pizza.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Top Badges (Floating) */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className={`w-8 h-8 rounded-xl bg-background border-4 border-foreground flex items-center justify-center shadow-[2px_2px_0px_0px_hsl(var(--foreground))]`}>
            <div className={`w-3 h-3 rounded-full ${pizza.isVeg ? 'bg-green-500' : 'bg-red-500'} border-2 border-foreground`} />
          </div>
          
          {pizza.tag && (
            <span className="bg-primary text-foreground border-4 border-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Flame className="w-3.5 h-3.5" /> {pizza.tag}
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 bg-background px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 border-4 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))] z-10">
          <Star className="w-4 h-4 text-accent fill-accent" /> {pizza.rating || '4.8'}
        </div>

      </div>
      
      {/* Content Section */}
      <div className="p-6 pt-5 flex flex-col flex-grow relative z-10 bg-card">
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground leading-tight group-hover:text-primary transition-colors duration-300">
            {pizza.name}
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2 leading-relaxed font-bold">
          {pizza.description}
        </p>
        
        <div className="flex flex-col gap-5 mt-auto">
          {/* Price & Calories Row */}
          <div className="flex items-center justify-between pb-5 border-b-4 border-foreground/10">
            <span className="text-4xl font-['Chewy'] tracking-wide text-foreground">
              Rs.{pizza.basePrice || pizza.price || 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-foreground bg-secondary px-3 py-1.5 rounded-xl border-2 border-foreground shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <Flame className="w-3.5 h-3.5 text-accent" /> {pizza.calories || '850'} kcal
            </span>
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex items-center gap-3">
            {onQuickAdd && (
              <button 
                onClick={(e) => { e.stopPropagation(); onQuickAdd(pizza); }}
                className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background border-4 border-foreground px-2 py-3 rounded-xl text-lg font-['Chewy'] tracking-wide shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-1 transition-all duration-300"
              >
                <ShoppingCart className="w-5 h-5" /> Add
              </button>
            )}
            <button 
              onClick={() => onCustomize(pizza)}
              className="flex-1 flex items-center justify-center gap-2 text-lg font-['Chewy'] tracking-wide border-4 border-foreground bg-background hover:bg-primary text-foreground px-2 py-3 rounded-xl transition-all duration-300 shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-1 group/cust"
            >
              Customize <ArrowRight className="w-5 h-5 group-hover/cust:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
