import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Star, Flame } from 'lucide-react';
import Button from '../ui/Button';

const PizzaCard = ({ pizza, onCustomize, onQuickAdd }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-[2rem] overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-secondary">
        <img 
          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'} 
          alt={pizza.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
        />
        
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-90 transition-opacity duration-300" />
        
        {/* Top Badges (Floating) */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <div className={`w-6 h-6 rounded-md backdrop-blur-md bg-background/50 border flex items-center justify-center shadow-sm ${
            pizza.isVeg ? 'border-green-500/50' : 'border-red-500/50'
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full ${pizza.isVeg ? 'bg-green-500' : 'bg-red-500'} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
          </div>
          
          {pizza.tag && (
            <span className="bg-gradient-to-r from-accent to-amber-500 text-accent-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Flame className="w-3 h-3" /> {pizza.tag}
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 backdrop-blur-md bg-background/60 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg border border-white/10 z-10">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" /> {pizza.rating || '4.8'}
        </div>

        {/* Floating Quick Add Button (Bottom Right of Image) */}
        {onQuickAdd && (
          <button 
            onClick={(e) => { e.stopPropagation(); onQuickAdd(pizza); }}
            className="absolute -bottom-5 right-6 w-14 h-14 bg-gradient-to-tr from-primary to-rose-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all duration-300 z-20 group/btn"
          >
            <ShoppingCart className="w-6 h-6 group-hover/btn:-rotate-12 transition-transform" />
          </button>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6 pt-4 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start mb-3 gap-3 pr-16">
          <h3 className="text-xl md:text-2xl font-black font-heading leading-tight group-hover:text-primary transition-colors duration-300">
            {pizza.name}
          </h3>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2 leading-relaxed font-medium">
          {pizza.description}
        </p>
        
        <div className="flex flex-col gap-4 mt-auto">
          {/* Price & Calories Row */}
          <div className="flex items-center justify-between pb-4 border-b border-border/50">
            <span className="text-2xl font-black text-foreground tracking-tight">
              ₹{pizza.basePrice || pizza.price || 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-secondary/80 px-3 py-1.5 rounded-xl border border-border/50">
              <Flame className="w-3.5 h-3.5 text-accent" /> {pizza.calories || '850'} kcal
            </span>
          </div>
          
          {/* Action Buttons Row */}
          <button 
            onClick={() => onCustomize(pizza)}
            className="w-full flex items-center justify-center gap-2 text-sm font-bold font-heading border-2 border-border bg-background hover:bg-secondary/80 hover:border-foreground/20 text-foreground px-6 py-3.5 rounded-2xl transition-all duration-300 group/cust"
          >
            Customize Pizza <ArrowRight className="w-4 h-4 group-hover/cust:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
