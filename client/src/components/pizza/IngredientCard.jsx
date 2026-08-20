import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const IngredientCard = ({ ingredient, isSelected, onClick }) => {
  return (
    <motion.div 
      className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
          : 'border-border bg-card hover:border-primary/40 hover:bg-secondary/50'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="h-32 w-full overflow-hidden bg-secondary flex items-center justify-center">
        {ingredient.image ? (
          <img 
            src={ingredient.image} 
            alt={ingredient.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          <div className="text-4xl font-heading text-muted-foreground opacity-20">
             {ingredient.category.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-bold font-heading text-foreground leading-tight">{ingredient.name}</h4>
          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="bg-primary rounded-full p-1 flex-shrink-0"
            >
              <Check size={12} className="text-primary-foreground font-bold" />
            </motion.div>
          )}
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          {ingredient.price === 0 ? 'Included' : `+ ₹${ingredient.price}`}
        </p>
      </div>
    </motion.div>
  );
};

export default IngredientCard;
