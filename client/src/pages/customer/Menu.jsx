import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAllPizzas } from '../../services/pizzaService';
import useCartStore from '../../store/cartStore';
import { toast } from 'sonner';
import PizzaCard from '../../components/pizza/PizzaCard';
import SEO from '../../components/SEO';
import { Search, SlidersHorizontal, ShoppingCart, X, ChevronDown, Flame, Leaf, Star } from 'lucide-react';

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
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'bestseller', label: 'Bestsellers', icon: Flame },
  { id: 'veg', label: 'Vegetarian', icon: Leaf },
  { id: 'nonveg', label: 'Non-Veg', icon: null },
  { id: 'new', label: 'New Arrivals', icon: Star },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
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
      price: pizza.basePrice || pizza.price,
    });
    toast.success(`${pizza.name} added to cart!`);
  };

  // Filter and sort logic
  const filteredPizzas = useMemo(() => {
    let result = [...pizzas];
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (activeCategory === 'veg') {
      result = result.filter(p => p.isVeg === true);
    } else if (activeCategory === 'nonveg') {
      result = result.filter(p => p.isVeg === false);
    } else if (activeCategory === 'bestseller') {
      result = result.filter(p => p.tag && (p.tag.toLowerCase().includes('best') || p.tag.toLowerCase().includes('popular')));
    } else if (activeCategory === 'new') {
      result = result.filter(p => p.tag && p.tag.toLowerCase().includes('new'));
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
    <div className="min-h-[calc(100vh-64px)] bg-background py-12">
      <SEO title="Menu" description="Explore our premium pizza menu. Fresh ingredients, perfectly baked." />
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
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

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          {/* Search Input */}
          <div className="relative max-w-lg mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pizzas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-card border border-border rounded-2xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Category Tabs & Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {cat.icon && <cat.icon className="w-3.5 h-3.5" />}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {SORT_OPTIONS.find(s => s.id === sortBy)?.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                  >
                    {SORT_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => { setSortBy(option.id); setShowSortDropdown(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          sortBy === option.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-foreground/80 hover:bg-secondary'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {!isLoading && (
          <p className="text-sm text-muted-foreground mb-6">
            Showing <span className="font-semibold text-foreground">{filteredPizzas.length}</span> pizza{filteredPizzas.length !== 1 ? 's' : ''}
            {searchQuery && <> for "<span className="text-primary">{searchQuery}</span>"</>}
          </p>
        )}

        {/* Pizza Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredPizzas.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredPizzas.map((pizza) => (
                <PizzaCard 
                  key={pizza._id} 
                  pizza={pizza} 
                  onCustomize={handleCustomize}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16"
            >
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">No pizzas found</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="text-primary font-semibold text-sm hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
