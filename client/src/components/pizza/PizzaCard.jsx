import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import Button from '../ui/Button';

const PizzaCard = ({ pizza, onCustomize }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col h-full"
    >
      <div className="relative h-48 md:h-56 overflow-hidden bg-secondary">
        <img 
          src={pizza.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'} 
          alt={pizza.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
          <span className="text-accent">★</span> {pizza.rating || '4.8'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-bold font-heading leading-tight">{pizza.name}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">₹{pizza.basePrice || pizza.price || 0}</span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-2">
          {pizza.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-1 rounded-md">
            {pizza.calories || '850'} kcal
          </span>
          <Button 
            variant="premium" 
            size="sm" 
            onClick={() => onCustomize(pizza)}
            className="rounded-full shadow-md shadow-primary/20 group-hover:bg-primary/90"
          >
            Customize
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
