import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Truck, Clock, Leaf, ArrowRight, CheckCircle2, ShoppingCart, Settings2, Star, Sparkles, Flame, Shield } from 'lucide-react';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';
import useCartStore from '../../store/cartStore';
import { toast } from 'sonner';
import PizzaCard from '../../components/pizza/PizzaCard';

const featuredPizzas = [
  {
    _id: '1',
    name: 'Classic Margherita',
    description: 'Fresh mozzarella, San Marzano tomato sauce, and fragrant basil leaves.',
    price: 12.99,
    rating: 4.8,
    calories: 850,
    tag: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '2',
    name: 'Spicy Pepperoni',
    description: 'Double pepperoni, jalapeños, and three-cheese blend on hand-tossed dough.',
    price: 15.99,
    rating: 4.9,
    calories: 1100,
    tag: 'Most Popular',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
  },
  {
    _id: '3',
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, truffle oil, ricotta, and fresh thyme on thin crust.',
    price: 18.99,
    rating: 4.9,
    calories: 800,
    tag: 'Chef\'s Pick',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
  }
];

const features = [
  {
    icon: <Leaf className="w-7 h-7" />,
    title: 'Farm Fresh',
    description: 'Locally sourced ingredients, prepared daily for maximum flavor.',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-400'
  },
  {
    icon: <ChefHat className="w-7 h-7" />,
    title: 'Custom Recipes',
    description: 'Build your own with our advanced step-by-step pizza configurator.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    iconColor: 'text-amber-400'
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: 'Lightning Fast',
    description: 'Average delivery under 25 minutes. Hot, fresh, guaranteed.',
    gradient: 'from-primary/20 to-rose-500/20',
    iconColor: 'text-primary'
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Track & Trace',
    description: 'Real-time order tracking from kitchen to your doorstep.',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-blue-400'
  }
];

const processSteps = [
  { icon: <CheckCircle2 />, title: 'Choose', desc: 'Pick your base & style', num: '01' },
  { icon: <Settings2 />, title: 'Customize', desc: 'Add premium toppings', num: '02' },
  { icon: <ShoppingCart />, title: 'Order', desc: 'Secure Razorpay checkout', num: '03' },
  { icon: <Truck />, title: 'Track', desc: 'Live delivery updates', num: '04' },
  { icon: <ChefHat />, title: 'Enjoy', desc: 'Hot & fresh at your door', num: '05' }
];

const stats = [
  { value: '15K+', label: 'Happy Customers' },
  { value: '50+', label: 'Premium Toppings' },
  { value: '25m', label: 'Avg. Delivery' },
  { value: '4.9', label: 'App Rating', icon: <Star className="w-4 h-4 text-accent inline ml-1" /> }
];

const testimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'Food Blogger',
    text: 'Pizzaro\'s build-your-own feature is unmatched. The truffle mushroom with extra cheese is divine!',
    avatar: 'SA',
    rating: 5
  },
  {
    name: 'Usman Khan',
    role: 'Regular Customer',
    text: 'Fastest delivery I\'ve ever experienced. The pizza arrives piping hot every single time.',
    avatar: 'UK',
    rating: 5
  },
  {
    name: 'Ayesha Malik',
    role: 'Pizza Enthusiast',
    text: 'The real-time tracking is so satisfying. I can literally watch my pizza being prepared!',
    avatar: 'AM',
    rating: 5
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const Home = () => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleQuickAdd = (pizza) => {
    addToCart({
      name: pizza.name,
      image: pizza.image,
      pizzaId: pizza._id,
      isCustom: false,
      quantity: 1,
      price: pizza.basePrice || pizza.price,
    });
    toast.success(`${pizza.name} added to cart!`);
  };

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden">
      <SEO title="Home" />
      
      {/* ─── HERO ─── */}
      <section className="relative min-h-[100dvh] pt-24 pb-12 md:pt-32 flex flex-col justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000" 
            alt="Premium Pizza" 
            className="w-full h-full object-cover scale-105"
          />
        </div>
        
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0" />
        
        <div className="container relative z-20 mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-foreground/80">Now with Real-Time Order Tracking</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold font-heading mb-6 leading-[0.95] tracking-tight">
              Your Pizza.<br />
              <span className="text-gradient">Your Rules.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-foreground/60 mb-8 max-w-lg leading-relaxed">
              Build your perfect pizza from 50+ premium ingredients and track every step from our kitchen to your doorstep.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10 md:mb-12">
              <Link to="/build">
                <Button variant="default" size="lg" className="text-base md:text-lg px-8 md:px-10 py-6 rounded-full shadow-xl shadow-primary/30 glow-primary bg-primary text-primary-foreground hover:bg-primary/90">
                  <Flame className="w-5 h-5 mr-2" /> Build Your Pizza
                </Button>
              </Link>
              <Link to="/menu">
                <Button variant="default" size="lg" className="text-base md:text-lg px-8 md:px-10 py-6 rounded-full shadow-xl shadow-primary/30 glow-primary bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore Menu
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {stats.map((stat, i) => (
                <div key={i} className="glass rounded-2xl px-5 py-4 text-center">
                  <p className="text-2xl md:text-3xl font-extrabold font-heading text-foreground">
                    {stat.value}{stat.icon}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 bg-secondary/50 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm font-bold tracking-widest uppercase text-accent mb-3"
            >
              Simple Process
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold font-heading"
            >
              How It Works
            </motion.h2>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-start gap-6 md:gap-0 relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-border to-transparent z-0" />
            
            {processSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative z-10 flex flex-col items-center flex-1 group"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-5 shadow-lg group-hover:border-primary/50 group-hover:glow-primary transition-all duration-300">
                    {React.cloneElement(step.icon, { className: 'w-7 h-7 text-primary' })}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center shadow-md">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-1 font-heading">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[140px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PIZZAS ─── */}
      <section className="py-28 bg-background relative">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Curated Selection</p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading">Featured Pizzas</h2>
            </div>
            <Link to="/menu" className="hidden md:flex items-center text-primary hover:text-primary/80 font-semibold transition-colors group">
              View full menu <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <motion.div key={pizza._id} variants={itemVariants} className="h-full">
                <PizzaCard 
                  pizza={pizza} 
                  onQuickAdd={handleQuickAdd} 
                  onCustomize={(p) => navigate(`/build?pizza=${p._id}`)} 
                />
              </motion.div>
            ))}
          </motion.div>
          
          <div className="mt-12 text-center md:hidden">
            <Link to="/menu">
              <Button variant="outline" className="w-full rounded-xl">View full menu</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHY PIZZARO ─── */}
      <section className="py-28 bg-card/50 border-t border-border/50 relative">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <p className="text-sm font-bold tracking-widest uppercase text-accent mb-3">Why Choose Us</p>
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading mb-5">The Pizzaro Difference</h2>
            <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              We obsess over every detail so you get the perfect pizza, every single time.
            </p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                className="group bg-background p-8 rounded-3xl border border-border text-center hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.iconColor}>{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold mb-3 font-heading">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-28 bg-background relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <p className="text-sm font-bold tracking-widest uppercase text-primary mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-5xl font-extrabold font-heading">Loved by Pizza Fans</h2>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass rounded-3xl p-8 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-8 text-sm">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* ─── CTA ─── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-rose-700 z-0" />
        <div className="absolute inset-0 opacity-[0.07] z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-6xl font-extrabold font-heading mb-6 text-primary-foreground leading-tight">
              Ready to create<br />your masterpiece?
            </h2>
            <p className="text-primary-foreground/70 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
              Join 15,000+ pizza lovers who have already discovered the Pizzaro difference. Your perfect pizza is just 5 taps away.
            </p>
            <Link to="/build">
              <Button size="lg" className="bg-background text-primary hover:bg-background/90 text-lg px-12 py-7 rounded-full shadow-2xl font-bold">
                Start Building Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
