import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import styles from './PizzaCard.module.css';

const PizzaCard = ({ pizza }) => {
  return (
    <motion.div 
      className={styles.card}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.imageContainer}>
        <img src={pizza.image} alt={pizza.name} className={styles.image} />
        {pizza.isFeatured && <span className={styles.badge}>Featured</span>}
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{pizza.name}</h3>
          <span className={styles.price}>₹{pizza.basePrice}</span>
        </div>
        
        <p className={styles.description}>{pizza.description}</p>
        
        <div className={styles.footer}>
          <div className={styles.rating}>
            <span className={styles.star}>★</span>
            <span>{pizza.rating}</span>
          </div>
          
          <Link to={`/build?pizza=${pizza._id}`} className={styles.action}>
            <Button variant="premium" size="sm">Customize</Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
