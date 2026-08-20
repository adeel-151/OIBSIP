import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PizzaPreview.module.css';

const PizzaPreview = ({ base, sauce, cheese, vegetables }) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.pizzaBoard}>
        {/* Base Layer */}
        <AnimatePresence>
          {base && (
            <motion.div 
              key="base"
              className={`${styles.layer} ${styles.layerBase}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.4 }}
            >
              <div className={styles.baseCrust}>
                <span className={styles.label}>{base.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sauce Layer */}
        <AnimatePresence>
          {sauce && (
            <motion.div 
              key="sauce"
              className={`${styles.layer} ${styles.layerSauce}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 0.9, opacity: 0.9 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3 }}
            >
              <div className={styles.sauceBlob}>
                <span className={styles.label}>{sauce.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cheese Layer */}
        <AnimatePresence>
          {cheese && (
            <motion.div 
              key="cheese"
              className={`${styles.layer} ${styles.layerCheese}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.95 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.cheeseMelt}>
                <span className={styles.label}>{cheese.name}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vegetables Layer */}
        <div className={`${styles.layer} ${styles.layerVeggies}`}>
          <AnimatePresence>
            {vegetables.map((veg, index) => (
              <motion.div
                key={veg._id}
                className={styles.veggieItem}
                style={{
                  // Distribute veggies somewhat randomly
                  top: `${20 + (index * 15) % 60}%`,
                  left: `${20 + (index * 25) % 60}%`,
                  transform: `rotate(${index * 45}deg)`
                }}
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: index * 45 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', bounce: 0.5, delay: index * 0.05 }}
              >
                <div className={styles.veggieDot} title={veg.name}></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {!base && !sauce && !cheese && vegetables.length === 0 && (
          <div className={styles.emptyState}>
            <p>Select a base to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaPreview;
