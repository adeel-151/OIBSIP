import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Star, Flame } from 'lucide-react';
import Button from '../ui/Button';

const PizzaCard = ({ pizza, onCustomize, onQuickAdd }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-full"
    >
      <div className="relative h-48 md:h-56 overflow-hidden bg-secondary">
        <img 
          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'} 
          alt={pizza.name} 
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {/* Veg/Non-Veg Badge */}
          <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
            pizza.isVeg ? 'border-green-500' : 'border-red-500'
          }`}>
            <div className={`w-2 h-2 rounded-full ${pizza.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
          </div>
          
          {/* Tag Badge */}
          {pizza.tag && (
            <span className="bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
              <Flame className="w-2.5 h-2.5" /> {pizza.tag}
            </span>
          )}
        </div>
        
        <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-accent fill-accent" /> {pizza.rating || '4.8'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg font-bold font-heading leading-tight">{pizza.name}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">₹{pizza.basePrice || pizza.price || 0}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-5 flex-grow line-clamp-2 leading-relaxed">
          {pizza.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
            🔥 {pizza.calories || '850'} kcal
          </span>
          <div className="flex items-center gap-2">
            {onQuickAdd && (
              <Button 
                variant="default" 
                size="sm" 
                className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all text-xs px-3"
                onClick={(e) => { e.stopPropagation(); onQuickAdd(pizza); }}
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            )}
            <Button 
              variant="premium" 
              size="sm" 
              onClick={() => onCustomize(pizza)}
              className="rounded-full shadow-md shadow-accent/20 group-hover:bg-accent/90 text-xs px-3"
            >
              Customize <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
