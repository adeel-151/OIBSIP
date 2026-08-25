import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Pizza, Heart, Clock, Award, Users, Flame } from 'lucide-react';
import SEO from '../../components/SEO';

const ABOUT_HERO = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop'; // Restaurant interior or pizza making
const CHEF_IMG = 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=800&auto=format&fit=crop'; // Chef
const DOUGH_IMG = 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop'; // Flour/Dough

const About = () => {
  return (
    <div className="min-h-screen bg-background font-sans pt-20">
      <SEO title="About Us | Pizzaro" />

      {/* Hero Section */}
      <section className="relative w-full bg-foreground py-20 lg:py-32 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500 rounded-full blur-[120px] opacity-20 translate-y-1/2 -translate-x-1/4"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-['Chewy'] tracking-widest text-2xl uppercase">
              
              The Pizzaro Story
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-['Chewy'] text-6xl md:text-8xl text-background tracking-wide drop-shadow-md">
              
              More Than Just Pizza
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-background/80 text-lg md:text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
              
              From a humble street-side oven to your favorite neighborhood joint. We’re on a mission to bring authentic, wood-fired magic to every slice.
            </motion.p>
          </div>
          
          <div className="w-full md:w-1/2 relative flex justify-center">
             <motion.img
              initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              src={ABOUT_HERO}
              alt="Our Restaurant"
              className="w-[90%] max-w-[500px] h-[400px] object-cover rounded-[3rem] shadow-[12px_12px_0px_0px_hsl(var(--primary))] border-4 border-background" />
            
          </div>
        </div>
      </section>

      {/* Our Values / Stats */}
      <section className="py-20 bg-background relative -mt-6">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Value Card 1 */}
            <motion.div whileHover={{ y: -10 }} className="bg-card border-4 border-foreground rounded-3xl p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center border-4 border-foreground rotate-3">
                <Flame className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground tracking-wide">Wood Fired</h3>
              <p className="text-muted-foreground font-medium">Baked at 800°F for that perfect crispy, airy crust.</p>
            </motion.div>

            {/* Value Card 2 */}
            <motion.div whileHover={{ y: -10 }} className="bg-primary border-4 border-foreground rounded-3xl p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-background rounded-2xl flex items-center justify-center border-4 border-foreground -rotate-3">
                <Heart className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground tracking-wide">Made with Love</h3>
              <p className="text-foreground/80 font-bold">Secret recipes handed down through generations.</p>
            </motion.div>

            {/* Value Card 3 */}
            <motion.div whileHover={{ y: -10 }} className="bg-card border-4 border-foreground rounded-3xl p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-500 rounded-2xl flex items-center justify-center border-4 border-foreground rotate-6">
                <Clock className="w-8 h-8 text-background" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground tracking-wide">Fast Delivery</h3>
              <p className="text-muted-foreground font-medium">Hot and fresh to your door in under 30 minutes.</p>
            </motion.div>

            {/* Value Card 4 */}
            <motion.div whileHover={{ y: -10 }} className="bg-card border-4 border-foreground rounded-3xl p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))] text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center border-4 border-foreground -rotate-6">
                <Award className="w-8 h-8 text-foreground" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground tracking-wide">Top Quality</h3>
              <p className="text-muted-foreground font-medium">We only source the freshest, organic local ingredients.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Heritage / Process Section */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            
            <div className="w-full lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <img src={CHEF_IMG} alt="Chef" className="w-full h-[300px] object-cover rounded-3xl border-4 border-background shadow-[8px_8px_0px_0px_hsl(var(--primary))] transform -rotate-3 hover:rotate-0 transition-transform duration-300" />
                <img src={DOUGH_IMG} alt="Dough Making" className="w-full h-[300px] object-cover rounded-3xl border-4 border-background shadow-[8px_8px_0px_0px_#ef4444] transform rotate-3 hover:rotate-0 transition-transform duration-300 translate-y-8" />
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <p className="text-primary font-['Chewy'] text-2xl mb-2">Our Heritage</p>
                <h2 className="font-['Chewy'] text-5xl md:text-6xl tracking-wide">The Secret is in the Dough</h2>
              </div>
              <div className="space-y-6 text-background/80 text-lg leading-relaxed">
                <p>
                  At Pizzaro, we believe that a great pizza starts with a great foundation. That's why our dough is cold-fermented for a full 48 hours. This slow process develops a complex flavor and creates that signature airy, crispy crust you know and love.
                </p>
                <p>
                  Our sauce? Hand-crushed San Marzano tomatoes, a pinch of sea salt, and fresh basil. No added sugars, no preservatives. Just pure, vibrant flavor.
                </p>
              </div>
              
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                    <Pizza className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="font-bold text-xl">100% Hand-stretched dough</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center border-2 border-background">
                    <Users className="w-5 h-5 text-background" />
                  </div>
                  <span className="font-bold text-xl">Family owned and operated since 2010</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-foreground/10 rotate-45">
          <Pizza size={120} />
        </div>
        <div className="absolute bottom-10 right-10 text-foreground/10 -rotate-12">
          <Pizza size={160} />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="font-['Chewy'] text-6xl md:text-8xl text-foreground tracking-wide mb-6">
            Hungry Yet?
          </h2>
          <p className="text-foreground/80 font-bold text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Stop reading and start eating! Build your own masterpiece or choose from our classic menu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/menu">
              <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-foreground font-bold text-2xl px-12 py-5 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                Explore Menu
              </button>
            </Link>
            <Link to="/build">
              <button className="w-full sm:w-auto bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold text-2xl px-12 py-5 rounded-full shadow-md hover:scale-105 transition-all duration-300">
                Build a Pizza
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>);

};

export default About;