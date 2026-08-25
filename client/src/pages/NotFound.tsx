import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Pizza, Search } from 'lucide-react';
import Button from '../components/ui/Button';
import SEO from '../components/SEO';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist." />

      {/* Decorative Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Animated Pizza Icon */}
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
          className="mb-8 inline-flex"
        >
          <div className="w-28 h-28 rounded-3xl bg-card border border-border flex items-center justify-center shadow-xl relative">
            <Pizza className="w-14 h-14 text-primary" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg shadow-md"
            >
              ?
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-8xl md:text-9xl font-extrabold font-heading text-gradient mb-4 leading-none"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold font-heading mb-4"
        >
          This slice doesn't exist
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed"
        >
          Looks like this page got lost on the way to your door. Let's get you back to something delicious.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 glow-primary">
              <Home className="w-4 h-4 mr-2" /> Go Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" size="lg" className="rounded-full px-8 border-2 border-border/80 bg-card/40 backdrop-blur-xl hover:bg-card/80">
              <Search className="w-4 h-4 mr-2" /> Browse Menu
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
