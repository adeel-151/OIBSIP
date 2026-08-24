import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const IngredientCard = ({ ingredient, isSelected, onClick }) => {
  return (
    <motion.div 
      className={`relative cursor-pointer rounded-3xl overflow-hidden border-4 transition-all duration-300 ${
        isSelected 
          ? 'border-foreground bg-primary shadow-xl shadow-primary/20 scale-105' 
          : 'border-transparent hover:border-foreground bg-background hover:scale-105 shadow-md'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="h-24 sm:h-32 w-full overflow-hidden bg-secondary flex items-center justify-center border-b-4 border-foreground">
        {ingredient.image ? (
          <img 
            src={ingredient.image} 
            alt={ingredient.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200' }}
          />
        ) : (
          <div className="text-4xl font-['Chewy'] text-muted-foreground opacity-20">
             {ingredient.category.charAt(0)}
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className={`font-['Chewy'] text-lg sm:text-xl leading-tight tracking-wide ${isSelected ? 'text-foreground' : 'text-foreground'}`}>
            {ingredient.name}
          </h4>
          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="bg-foreground rounded-full p-1 flex-shrink-0"
            >
              <Check size={14} className="text-background font-bold" />
            </motion.div>
          )}
        </div>
        <p className={`text-sm font-bold ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}`}>
          {ingredient.price === 0 ? 'Included' : `+ Rs.${ingredient.price}`}
        </p>
      </div>
    </motion.div>
  );
};

export default IngredientCard;
