import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Truck, Clock, Leaf, ArrowRight, CheckCircle2, ShoppingCart, Settings2 } from 'lucide-react';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';

// Mock data for featured pizzas
const featuredPizzas = [
  {
    _id: '1',
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, tomato sauce, and basil on a classic thin crust.',
    price: 12.99,
    rating: 4.8,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '2',
    name: 'Spicy Pepperoni',
    description: 'Double pepperoni, jalapeños, and extra cheese on a hand-tossed base.',
    price: 15.99,
    rating: 4.9,
    calories: 1100,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '3',
    name: 'Garden Supreme',
    description: 'Mushrooms, bell peppers, onions, and black olives.',
    price: 14.99,
    rating: 4.7,
    calories: 900,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  }
];

const features = [
  {
    icon: <Leaf className="w-8 h-8 text-primary" />,
    title: 'Fresh Ingredients',
    description: 'Locally sourced, premium quality ingredients prepared daily.'
  },
  {
    icon: <ChefHat className="w-8 h-8 text-accent" />,
    title: 'Custom Recipes',
    description: 'Create your perfect pizza with our advanced builder.'
  },
  {
    icon: <Truck className="w-8 h-8 text-primary" />,
    title: 'Fast Delivery',
    description: 'Hot and fresh to your doorstep in 30 minutes or less.'
  },
  {
    icon: <Clock className="w-8 h-8 text-accent" />,
    title: 'Real-Time Tracking',
    description: 'Watch your order go from the oven to your location.'
  }
];

const processSteps = [
  { icon: <CheckCircle2 />, title: 'Choose', desc: 'Select a base' },
  { icon: <Settings2 />, title: 'Customize', desc: 'Add toppings' },
  { icon: <ShoppingCart />, title: 'Order', desc: 'Secure checkout' },
  { icon: <Truck />, title: 'Track', desc: 'Live updates' },
  { icon: <ChefHat />, title: 'Enjoy', desc: 'Hot & fresh' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SEO title="Home" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Pizza Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-20 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold font-heading mb-6 leading-tight">
              Your Pizza.<br />
              <span className="text-primary">Your Rules.</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-lg leading-relaxed">
              Build your perfect pizza from fresh ingredients and track every step from kitchen to doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/build">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg shadow-primary/25">
                  Build Your Pizza
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 bg-background/50 backdrop-blur-sm">
                  Explore Menu
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-secondary-foreground">How It Works</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative max-w-5xl mx-auto">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0" />
            
            {processSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center flex-1"
              >
                <div className="w-20 h-20 rounded-full bg-card border-4 border-background flex items-center justify-center mb-4 shadow-xl text-primary">
                  {React.cloneElement(step.icon, { className: 'w-8 h-8' })}
                </div>
                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pizzas Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Featured Pizzas</h2>
              <p className="text-muted-foreground">Our chef's finest creations, ready to order.</p>
            </div>
            <Link to="/menu" className="hidden md:flex items-center text-primary hover:text-primary/80 font-medium transition-colors">
              View full menu <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredPizzas.map((pizza) => (
              <motion.div 
                key={pizza._id} 
                variants={itemVariants}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <span className="text-accent">★</span> {pizza.rating}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold font-heading">{pizza.name}</h3>
                    <span className="text-lg font-bold text-primary">${pizza.price}</span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{pizza.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground/60 bg-secondary px-2 py-1 rounded">
                      {pizza.calories} kcal
                    </span>
                    <Button variant="premium" size="sm" className="rounded-full">
                      Customize
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/menu">
              <Button variant="outline" className="w-full">View full menu</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Pizzaro Section */}
      <section className="py-24 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Why Pizzaro</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've engineered the perfect pizza experience from our kitchen directly to your table.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="bg-background p-8 rounded-2xl border border-border text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-16 h-16 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary z-0" />
        <div className="absolute inset-0 opacity-10 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-primary-foreground">Ready to create your masterpiece?</h2>
          <p className="text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-lg">
            Join thousands of pizza lovers who have already discovered the Pizzaro difference.
          </p>
          <Link to="/build">
            <Button size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-10 py-6 rounded-full shadow-2xl">
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
