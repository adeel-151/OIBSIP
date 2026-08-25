import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllPizzas } from '../../services/pizzaService';
import useCartStore from '../../store/cartStore';
import { toast } from 'sonner';
import PizzaCard from '../../components/pizza/PizzaCard';
import SEO from '../../components/SEO';
import { Search, SlidersHorizontal, X, ChevronDown, Flame, Leaf, Star } from 'lucide-react';

const MOCK_PIZZAS = [
{
  _id: 'm1', name: 'Classic Margherita',
  description: 'Fresh mozzarella, tomato sauce, and basil on a classic thin crust.',
  price: 299, basePrice: 299, rating: 4.8, calories: 850, tag: 'Best Seller', isVeg: true,
  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm2', name: 'Spicy Pepperoni',
  description: 'Double pepperoni, jalapeños, and extra cheese on a hand-tossed base.',
  price: 449, basePrice: 449, rating: 4.9, calories: 1100, tag: 'Most Popular', isVeg: false,
  image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm3', name: 'Garden Supreme',
  description: 'Mushrooms, bell peppers, onions, and black olives on a classic base.',
  price: 399, basePrice: 399, rating: 4.7, calories: 900, tag: 'Veggie', isVeg: true,
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm4', name: 'BBQ Chicken',
  description: 'Grilled chicken, BBQ sauce, red onions, and cilantro.',
  price: 499, basePrice: 499, rating: 4.8, calories: 1050, tag: 'Popular', isVeg: false,
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm5', name: 'Hawaiian',
  description: 'Pineapple, ham, and extra mozzarella on a crispy base.',
  price: 379, basePrice: 379, rating: 4.5, calories: 950, isVeg: false,
  image: 'https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm6', name: 'Truffle Mushroom',
  description: 'Truffle oil, wild mushrooms, ricotta, and thyme.',
  price: 549, basePrice: 549, rating: 4.9, calories: 800, tag: "Chef's Pick", isVeg: true,
  image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm7', name: 'Meat Lovers',
  description: 'Pepperoni, sausage, bacon, and ground beef with mozzarella.',
  price: 599, basePrice: 599, rating: 4.8, calories: 1300, tag: 'Bestseller', isVeg: false,
  image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm8', name: 'Paneer Tikka',
  description: 'Tandoori paneer, bell peppers, onions, and mint chutney.',
  price: 429, basePrice: 429, rating: 4.7, calories: 920, tag: 'New', isVeg: true,
  image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm9', name: 'Buffalo Ranch',
  description: 'Crispy chicken coated in spicy buffalo sauce with a ranch drizzle.',
  price: 479, basePrice: 479, rating: 4.8, calories: 1050, tag: 'Spicy', isVeg: false,
  image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm10', name: 'Spinach & Feta',
  description: 'Fresh spinach, crumbled feta, garlic oil, and mozzarella.',
  price: 389, basePrice: 389, rating: 4.6, calories: 750, isVeg: true,
  image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm11', name: 'Pesto Chicken',
  description: 'Grilled chicken, fresh pesto sauce, roasted tomatoes, and parmesan.',
  price: 529, basePrice: 529, rating: 4.9, calories: 980, tag: 'Must Try', isVeg: false,
  image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800'
},
{
  _id: 'm12', name: 'Margarita Extra',
  description: 'Double fresh mozzarella, cherry tomatoes, and extra basil leaves.',
  price: 349, basePrice: 349, rating: 4.7, calories: 880, isVeg: true,
  image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800'
}];


const CATEGORIES = [
{ id: 'all', label: 'All', icon: null },
{ id: 'bestseller', label: 'Bestsellers', icon: Flame },
{ id: 'veg', label: 'Vegetarian', icon: Leaf },
{ id: 'nonveg', label: 'Non-Veg', icon: null },
{ id: 'new', label: 'New Arrivals', icon: Star }];


const SORT_OPTIONS = [
{ id: 'popular', label: 'Most Popular' },
{ id: 'price-low', label: 'Price: Low to High' },
{ id: 'price-high', label: 'Price: High to Low' },
{ id: 'rating', label: 'Highest Rated' }];


const SkeletonCard = () =>
<div className="bg-card rounded-[2rem] overflow-hidden border-4 border-foreground shadow-[8px_8px_0px_0px_hsl(var(--foreground))] flex flex-col h-full animate-pulse">
    <div className="h-48 md:h-64 bg-foreground/10 w-full border-b-4 border-foreground" />
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="h-8 bg-foreground/20 rounded-xl w-2/3" />
        <div className="h-8 bg-foreground/20 rounded-xl w-1/4" />
      </div>
      <div className="space-y-3 mb-8">
        <div className="h-4 bg-foreground/10 rounded-lg w-full" />
        <div className="h-4 bg-foreground/10 rounded-lg w-5/6" />
      </div>
      <div className="flex items-center justify-between mt-auto pt-5 border-t-4 border-foreground/10">
        <div className="h-10 bg-foreground/20 rounded-xl w-20" />
        <div className="h-12 bg-foreground/20 rounded-xl w-28" />
      </div>
    </div>
  </div>;


const Menu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const response = await getAllPizzas();
        if (response?.data && response.data.length > 0) {
          setPizzas(response.data);
        } else {
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

  const handleQuickAdd = (pizza) => {
    addToCart({
      name: pizza.name,
      image: pizza.image,
      pizzaId: pizza._id,
      isCustom: false,
      quantity: 1,
      price: pizza.basePrice || pizza.price
    });
    toast.success(`${pizza.name} added to cart!`);
  };

  // Filter and sort logic
  const filteredPizzas = useMemo(() => {
    let result = [...pizzas];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (activeCategory === 'veg') {
      result = result.filter((p) => p.isVeg === true);
    } else if (activeCategory === 'nonveg') {
      result = result.filter((p) => p.isVeg === false);
    } else if (activeCategory === 'bestseller') {
      result = result.filter((p) => p.tag && (p.tag.toLowerCase().includes('best') || p.tag.toLowerCase().includes('popular')));
    } else if (activeCategory === 'new') {
      result = result.filter((p) => p.tag && p.tag.toLowerCase().includes('new'));
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.basePrice || a.price) - (b.basePrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.basePrice || b.price) - (a.basePrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [pizzas, searchQuery, activeCategory, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO title="Menu | Pizzaro" description="Explore our premium pizza menu. Fresh ingredients, perfectly baked." />
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-7xl font-['Chewy'] mb-6 tracking-wide text-foreground break-words">
            
            Explore Our <span className="text-primary">Menu</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl font-bold">
            
            Discover your next favorite pizza. Fresh ingredients, perfectly baked.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12">
          
          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-foreground font-bold" />
            <input
              type="text"
              placeholder="Search pizzas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-14 py-4 bg-background border-4 border-foreground rounded-full text-lg font-bold text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] transition-all" />
            
            {searchQuery &&
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-foreground text-background hover:scale-110 rounded-full transition-transform">
              
                <X className="w-5 h-5 font-bold" />
              </button>
            }
          </div>

          {/* Category Tabs & Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-card border-4 border-foreground p-4 rounded-3xl shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
              {CATEGORIES.map((cat) =>
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-lg font-['Chewy'] tracking-wide border-4 transition-all whitespace-nowrap ${
                activeCategory === cat.id ?
                'bg-primary text-foreground border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1' :
                'bg-background border-transparent text-muted-foreground hover:border-foreground/30 hover:bg-secondary'}`
                }>
                
                  {cat.icon && <cat.icon className="w-5 h-5" />}
                  {cat.label}
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="w-full md:w-auto flex items-center justify-between md:justify-start gap-3 px-6 py-3 bg-background border-4 border-foreground rounded-2xl text-lg font-['Chewy'] tracking-wide text-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:-translate-y-1 transition-all">
                
                <SlidersHorizontal className="w-5 h-5" />
                {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}
                <ChevronDown className={`w-5 h-5 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown &&
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-3 w-full md:w-56 bg-background border-4 border-foreground rounded-2xl shadow-[8px_8px_0px_0px_hsl(var(--foreground))] z-30 overflow-hidden">
                  
                    {SORT_OPTIONS.map((option) =>
                  <button
                    key={option.id}
                    onClick={() => {setSortBy(option.id);setShowSortDropdown(false);}}
                    className={`w-full text-left px-5 py-4 text-lg font-['Chewy'] tracking-wide border-b-4 border-foreground/10 last:border-0 transition-colors ${
                    sortBy === option.id ?
                    'bg-primary text-foreground' :
                    'text-muted-foreground hover:bg-foreground hover:text-background'}`
                    }>
                    
                        {option.label}
                      </button>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading &&
        <p className="text-lg font-bold text-muted-foreground mb-8 text-center md:text-left">
            Showing <span className="font-black text-foreground">{filteredPizzas.length}</span> pizza{filteredPizzas.length !== 1 ? 's' : ''}
            {searchQuery && <> for "<span className="text-primary">{searchQuery}</span>"</>}
          </p>
        }

        {/* Promotional Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16 bg-primary border-4 border-foreground rounded-[3rem] p-10 md:p-14 text-foreground flex flex-col md:flex-row items-center justify-between gap-8 shadow-[12px_12px_0px_0px_hsl(var(--foreground))] overflow-hidden relative">
          
          {/* Fun background graphics */}
          <div className="absolute top-10 right-10 text-foreground/10 rotate-12 pointer-events-none">
             <Star size={100} fill="currentColor" />
          </div>
          <div className="absolute -bottom-10 -left-10 text-background/30 -rotate-12 pointer-events-none">
             <Flame size={150} fill="currentColor" />
          </div>

          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-['Chewy'] tracking-wide mb-4 text-foreground drop-shadow-sm break-words">Can't find what you're craving?</h2>
            <p className="text-foreground/80 font-bold text-lg sm:text-xl">Be the chef! Build your perfect pizza from scratch with our 50+ premium ingredients.</p>
          </div>
          <button
            onClick={() => navigate('/build')}
            className="relative z-10 shrink-0 bg-foreground text-background hover:bg-background hover:text-foreground border-4 border-foreground px-6 sm:px-10 py-4 sm:py-5 rounded-full font-['Chewy'] text-xl sm:text-3xl tracking-wide shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-2 transition-all duration-300 whitespace-nowrap">
            
            Build Your Own
          </button>
        </motion.div>

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {isLoading ?
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />) :
          filteredPizzas.length > 0 ?
          <AnimatePresence mode="popLayout">
              {filteredPizzas.map((pizza) =>
            <PizzaCard
              key={pizza._id}
              pizza={pizza}
              onCustomize={handleCustomize}
              onQuickAdd={handleQuickAdd} />

            )}
            </AnimatePresence> :

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-24 bg-card border-4 border-foreground border-dashed rounded-[3rem]">
            
              <div className="w-24 h-24 bg-background border-4 border-foreground rounded-full flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                <Search className="w-12 h-12 text-foreground font-bold" />
              </div>
              <h3 className="text-4xl font-['Chewy'] text-foreground tracking-wide mb-3">No pizzas found</h3>
              <p className="text-muted-foreground font-bold text-lg mb-8 max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
              onClick={() => {setSearchQuery('');setActiveCategory('all');}}
              className="bg-primary text-foreground border-4 border-foreground rounded-full px-8 py-3 font-['Chewy'] text-xl tracking-wide shadow-[4px_4px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-1 transition-all">
              
                Clear all filters
              </button>
            </motion.div>
          }
        </div>
      </div>
    </div>);

};

export default Menu;