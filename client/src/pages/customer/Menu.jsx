import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllPizzas } from '../../services/pizzaService';
import { toast } from 'sonner';
import PizzaCard from '../../components/pizza/PizzaCard';
import SEO from '../../components/SEO';

const MOCK_PIZZAS = [
  {
    _id: 'm1',
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, tomato sauce, and basil on a classic thin crust.',
    price: 12.99,
    basePrice: 12.99,
    rating: 4.8,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'm2',
    name: 'Spicy Pepperoni',
    description: 'Double pepperoni, jalapeños, and extra cheese on a hand-tossed base.',
    price: 15.99,
    basePrice: 15.99,
    rating: 4.9,
    calories: 1100,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'm3',
    name: 'Garden Supreme',
    description: 'Mushrooms, bell peppers, onions, and black olives.',
    price: 14.99,
    basePrice: 14.99,
    rating: 4.7,
    calories: 900,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'm4',
    name: 'BBQ Chicken',
    description: 'Grilled chicken, BBQ sauce, red onions, and cilantro.',
    price: 16.99,
    basePrice: 16.99,
    rating: 4.8,
    calories: 1050,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'm5',
    name: 'Hawaiian',
    description: 'Pineapple, ham, and extra mozzarella on a crispy base.',
    price: 13.99,
    basePrice: 13.99,
    rating: 4.5,
    calories: 950,
    image: 'https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: 'm6',
    name: 'Truffle Mushroom',
    description: 'Truffle oil, wild mushrooms, ricotta, and thyme.',
    price: 18.99,
    basePrice: 18.99,
    rating: 4.9,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=800'
  }
];

const SkeletonCard = () => (
  <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm flex flex-col h-full animate-pulse">
    <div className="h-48 md:h-56 bg-secondary w-full" />
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="h-6 bg-secondary rounded w-2/3" />
        <div className="h-6 bg-secondary rounded w-1/4" />
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-secondary rounded w-full" />
        <div className="h-4 bg-secondary rounded w-5/6" />
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div className="h-6 bg-secondary rounded w-16" />
        <div className="h-8 bg-secondary rounded w-24 rounded-full" />
      </div>
    </div>
  </div>
);

const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await getAllPizzas();
        if (response?.data && response.data.length > 0) {
          setPizzas(response.data);
        } else {
          // Fallback to mock data if DB is empty
          setPizzas(MOCK_PIZZAS);
        }
      } catch (error) {
        setPizzas(MOCK_PIZZAS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const handleCustomize = (pizza) => {
    navigate(`/build?pizza=${pizza._id}`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-12">
      <SEO title="Menu" />
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 leading-tight"
          >
            Explore Our <span className="text-primary">Menu</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Discover your next favorite pizza. Fresh ingredients, perfectly baked.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="h-1 w-20 bg-accent mx-auto rounded-full mt-6" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <motion.div 
              className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
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
                <PizzaCard 
                  key={pizza._id} 
                  pizza={pizza} 
                  onCustomize={handleCustomize} 
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
