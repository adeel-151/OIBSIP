import React from 'react';
import { motion } from 'framer-motion';
import styles from './IngredientCard.module.css';
import { Check } from 'lucide-react';

const IngredientCard = ({ ingredient, isSelected, onClick }) => {
  return (
    <motion.div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className={styles.imageContainer}>
        {/* We would use real images, but placeholders for now */}
        <div className={styles.placeholderImg}>
           {ingredient.category.charAt(0)}
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.name}>{ingredient.name}</h4>
          {isSelected && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className={styles.checkIcon}
            >
              <Check size={16} color="white" />
            </motion.div>
          )}
        </div>
        <p className={styles.price}>
          {ingredient.price === 0 ? 'Included' : `+ ₹${ingredient.price}`}
        </p>
      </div>
    </motion.div>
  );
};

export default IngredientCard;
