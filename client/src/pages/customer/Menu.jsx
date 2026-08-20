import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import { toast } from 'sonner';
import PizzaCard from '../../components/pizza/PizzaCard';
import styles from './Menu.module.css';

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await getAllPizzas();
        setPizzas(response.data);
      } catch (error) {
        toast.error('Failed to load menu. Please try again later.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  return (
    <div className="container">
      <div className={styles.menuHeader}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          Explore Our Menu
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.subtitle}
        >
          Discover your next favorite pizza. Fresh ingredients, perfectly baked.
        </motion.p>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className="spinner"></div>
          <p>Loading delicious pizzas...</p>
        </div>
      ) : (
        <motion.div 
          className={styles.grid}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
        >
          {pizzas.map((pizza) => (
            <motion.div 
              key={pizza._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <PizzaCard pizza={pizza} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Menu;
