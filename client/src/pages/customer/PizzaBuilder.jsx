import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useBuilderStore from '../../store/builderStore';
import useCartStore from '../../store/cartStore';
import { getPizzaById } from '../../services/pizzaService';
import { getAllIngredients } from '../../services/ingredientService';
import PizzaPreview from '../../components/pizza/PizzaPreview';
import IngredientCard from '../../components/pizza/IngredientCard';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, ShoppingCart, Check, Ruler, Flame, Leaf } from 'lucide-react';
import SEO from '../../components/SEO';

const SIZES = [
  { id: 'small', name: 'Small', size: '7"', serves: '1 person', multiplier: 0.8, icon: '🍕' },
  { id: 'medium', name: 'Medium', size: '10"', serves: '2 people', multiplier: 1.0, icon: '🍕' },
  { id: 'large', name: 'Large', size: '13"', serves: '3-4 people', multiplier: 1.4, icon: '🍕🍕' },
  { id: 'party', name: 'Party', size: '16"', serves: '5-6 people', multiplier: 1.8, icon: '🍕🍕🍕' },
];

const STEPS = [
  { id: 'SIZE', title: 'Size', icon: Ruler },
  { id: 'BASE', title: 'Base' },
  { id: 'SAUCE', title: 'Sauce' },
  { id: 'CHEESE', title: 'Cheese' },
  { id: 'VEGETABLE', title: 'Veggies', icon: Leaf },
  { id: 'MEAT', title: 'Meats', icon: Flame },
  { id: 'REVIEW', title: 'Review' },
];

// Fallback ingredients in case backend is empty
const MOCK_INGREDIENTS = [
  { _id: 'b1', name: 'Classic Thin', category: 'BASE', price: 80, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'b2', name: 'Hand Tossed', category: 'BASE', price: 70, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'b3', name: 'Cheese Burst', category: 'BASE', price: 120, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'b4', name: 'Whole Wheat', category: 'BASE', price: 90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 's1', name: 'Classic Tomato', category: 'SAUCE', price: 0, image: 'https://images.unsplash.com/photo-1552604617-eea98aa27234?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 's2', name: 'Spicy Marinara', category: 'SAUCE', price: 20, image: 'https://images.unsplash.com/photo-1605646197171-ec3f84856f6c?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 's3', name: 'Pesto', category: 'SAUCE', price: 35, image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'c1', name: 'Mozzarella', category: 'CHEESE', price: 35, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'c2', name: 'Four Cheese', category: 'CHEESE', price: 60, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'c3', name: 'Parmesan', category: 'CHEESE', price: 45, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v1', name: 'Mushrooms', category: 'VEGETABLE', price: 25, image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v2', name: 'Bell Pepper', category: 'VEGETABLE', price: 15, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v3', name: 'Olives', category: 'VEGETABLE', price: 30, image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v4', name: 'Jalapeños', category: 'VEGETABLE', price: 20, image: 'https://images.unsplash.com/photo-1596486008688-66d48259d81d?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v5', name: 'Red Onions', category: 'VEGETABLE', price: 10, image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v6', name: 'Fresh Tomatoes', category: 'VEGETABLE', price: 15, image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'mt1', name: 'Pepperoni', category: 'MEAT', price: 45, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'mt2', name: 'Grilled Chicken', category: 'MEAT', price: 50, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'mt3', name: 'Italian Sausage', category: 'MEAT', price: 55, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'mt4', name: 'Bacon Strips', category: 'MEAT', price: 50, image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=200&h=200' },
];

const PizzaBuilder = () => {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizza');
  const navigate = useNavigate();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allIngredients, setAllIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]); // Default medium
  const [selectedMeats, setSelectedMeats] = useState([]);

  const { 
    initializeBuilder, resetBuilder,
    selectedBase, setBase,
    selectedSauce, setSauce,
    selectedCheese, setCheese,
    selectedVegetables, toggleVegetable,
    totalPrice
  } = useBuilderStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    const init = async () => {
      try {
        const ingredientsRes = await getAllIngredients();
        if (ingredientsRes?.data?.length > 0) {
          setAllIngredients(ingredientsRes.data);
        } else {
          setAllIngredients(MOCK_INGREDIENTS);
        }

        if (pizzaId) {
          const pizzaRes = await getPizzaById(pizzaId);
          initializeBuilder(pizzaRes.data);
        } else {
          resetBuilder();
        }
      } catch (error) {
        setAllIngredients(MOCK_INGREDIENTS);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [pizzaId, initializeBuilder, resetBuilder]);

  const currentStep = STEPS[currentStepIndex];

  const toggleMeat = (meat) => {
    setSelectedMeats(prev => {
      const exists = prev.some(m => m._id === meat._id);
      return exists ? prev.filter(m => m._id !== meat._id) : [...prev, meat];
    });
  };

  // Calculate total with size multiplier and meats
  const meatTotal = selectedMeats.reduce((sum, m) => sum + m.price, 0);
  const finalPrice = Math.round((totalPrice + meatTotal) * selectedSize.multiplier);

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      if (currentStep.id === 'SIZE' && !selectedSize) {
        toast.error('Please select a size');
        return;
      }
      if (currentStep.id === 'BASE' && !selectedBase) {
        toast.error('Please select a base to continue');
        return;
      }
      setCurrentStepIndex(prev => prev + 1);
    } else {
      const cartItem = {
        name: 'Custom Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        pizzaId: pizzaId || null,
        isCustom: true,
        customIngredients: {
          size: selectedSize,
          base: selectedBase,
          sauce: selectedSauce,
          cheese: selectedCheese,
          vegetables: selectedVegetables,
          meats: selectedMeats,
        },
        quantity: 1,
        price: finalPrice
      };
      
      addToCart(cartItem);
      toast.success('Custom pizza added to cart!');
      resetBuilder();
      navigate('/cart');
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    // SIZE step
    if (currentStep.id === 'SIZE') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SIZES.map(size => (
            <motion.div
              key={size.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSize(size)}
              className={`relative cursor-pointer rounded-2xl border-2 p-6 text-center transition-all duration-300 ${
                selectedSize.id === size.id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-card hover:border-primary/40'
              }`}
            >
              {selectedSize.id === size.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-primary rounded-full p-1">
                  <Check size={12} className="text-primary-foreground" />
                </motion.div>
              )}
              <div className="text-3xl mb-3">{size.icon}</div>
              <h4 className="font-bold text-lg font-heading">{size.name}</h4>
              <p className="text-sm text-muted-foreground">{size.size}</p>
              <p className="text-xs text-muted-foreground mt-1">{size.serves}</p>
              <p className="text-sm font-bold text-primary mt-3">
                {size.multiplier === 1 ? 'Base price' : `${size.multiplier}x`}
              </p>
            </motion.div>
          ))}
        </div>
      );
    }

    // REVIEW step
    if (currentStep.id === 'REVIEW') {
      return (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold font-heading mb-6 border-b border-border pb-4">Your Masterpiece</h3>
          <ul className="space-y-4 mb-8 text-foreground/90">
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Size</span>
                <span className="text-sm text-muted-foreground">{selectedSize.name} ({selectedSize.size})</span>
              </div>
              <span className="font-medium">{selectedSize.multiplier}x</span>
            </li>
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Base</span>
                <span className="text-sm text-muted-foreground">{selectedBase?.name}</span>
              </div>
              <span className="font-medium">+₹{selectedBase?.price}</span>
            </li>
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Sauce</span>
                <span className="text-sm text-muted-foreground">{selectedSauce?.name || 'None'}</span>
              </div>
              <span className="font-medium">+₹{selectedSauce?.price || 0}</span>
            </li>
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Cheese</span>
                <span className="text-sm text-muted-foreground">{selectedCheese?.name || 'None'}</span>
              </div>
              <span className="font-medium">+₹{selectedCheese?.price || 0}</span>
            </li>
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Vegetables</span>
                <span className="text-sm text-muted-foreground">
                  {selectedVegetables.length > 0 ? selectedVegetables.map(v => v.name).join(', ') : 'None'}
                </span>
              </div>
              <span className="font-medium">
                +₹{selectedVegetables.reduce((acc, curr) => acc + curr.price, 0)}
              </span>
            </li>
            <li className="flex justify-between items-center bg-secondary/50 p-4 rounded-lg">
              <div>
                <span className="font-bold block">Meats</span>
                <span className="text-sm text-muted-foreground">
                  {selectedMeats.length > 0 ? selectedMeats.map(m => m.name).join(', ') : 'None'}
                </span>
              </div>
              <span className="font-medium">
                +₹{meatTotal}
              </span>
            </li>
          </ul>
          <div className="border-t border-border pt-4 flex justify-between items-center">
            <span className="text-lg font-bold">Grand Total</span>
            <span className="text-3xl font-extrabold text-primary font-heading">₹{finalPrice}</span>
          </div>
        </div>
      );
    }

    // Ingredient selection steps
    const categoryId = currentStep.id;
    const availableIngredients = allIngredients.filter(i => i.category === categoryId);

    if (availableIngredients.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No {currentStep.title.toLowerCase()} available</p>
          <p className="text-sm">Skip this step or check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableIngredients.map(ingredient => {
          let isSelected = false;
          let onClick = () => {};

          if (categoryId === 'BASE') {
            isSelected = selectedBase?._id === ingredient._id;
            onClick = () => setBase(ingredient);
          } else if (categoryId === 'SAUCE') {
            isSelected = selectedSauce?._id === ingredient._id;
            onClick = () => setSauce(ingredient);
          } else if (categoryId === 'CHEESE') {
            isSelected = selectedCheese?._id === ingredient._id;
            onClick = () => setCheese(ingredient);
          } else if (categoryId === 'VEGETABLE') {
            isSelected = selectedVegetables.some(v => v._id === ingredient._id);
            onClick = () => toggleVegetable(ingredient);
          } else if (categoryId === 'MEAT') {
            isSelected = selectedMeats.some(m => m._id === ingredient._id);
            onClick = () => toggleMeat(ingredient);
          }

          return (
            <IngredientCard 
              key={ingredient._id}
              ingredient={ingredient}
              isSelected={isSelected}
              onClick={onClick}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stepDescriptions = {
    SIZE: 'Select how big you want your pizza',
    BASE: 'Pick your dough style',
    SAUCE: 'Choose your sauce (or skip)',
    CHEESE: 'Add your cheese (or skip)',
    VEGETABLE: 'Pick as many veggies as you like',
    MEAT: 'Add premium meats (optional)',
    REVIEW: 'Review your creation before ordering',
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-8">
      <SEO title="Pizza Builder" description="Build your perfect custom pizza with 50+ premium ingredients." />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Step Indicator */}
        <div className="mb-12 hidden md:flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />
          {/* Progress fill */}
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          />
          {STEPS.map((step, index) => {
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            return (
              <div 
                key={step.id} 
                className="relative z-10 flex flex-col items-center cursor-pointer group"
                onClick={() => index < currentStepIndex && setCurrentStepIndex(index)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isActive ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/20' : 
                  isCompleted ? 'bg-accent text-accent-foreground' : 
                  'bg-card text-muted-foreground border-2 border-border group-hover:border-primary/50'
                }`}>
                  {isCompleted ? <Check className="w-5 h-5" /> : `0${index + 1}`}
                </div>
                <span className={`mt-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-primary' : 
                  isCompleted ? 'text-accent' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Interactive Preview */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24 bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col items-center">
              <PizzaPreview 
                base={selectedBase} 
                sauce={selectedSauce} 
                cheese={selectedCheese} 
                vegetables={selectedVegetables} 
              />
              
              {/* Size Badge */}
              <div className="mb-4 px-4 py-2 bg-secondary/50 rounded-full text-sm font-medium text-muted-foreground">
                {selectedSize.icon} {selectedSize.name} ({selectedSize.size})
              </div>
              
              <div className="mt-4 w-full border-t border-border pt-6 flex justify-between items-center">
                <div>
                  <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Amount</span>
                  <h2 className="text-3xl font-bold font-heading text-primary">₹{finalPrice}</h2>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {selectedSize.multiplier !== 1 && (
                    <span className="block text-accent font-semibold">{selectedSize.multiplier}x size multiplier</span>
                  )}
                  Dynamic Pricing
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection Area */}
          <div className="w-full lg:w-2/3">
            {/* Mobile Step Indicator */}
            <div className="md:hidden mb-6 flex justify-between items-center bg-card p-4 rounded-xl border border-border">
              <span className="font-bold text-primary">Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span className="font-medium">{currentStep.title}</span>
            </div>

            <div className="bg-background min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold font-heading mb-2">
                      {currentStep.id === 'REVIEW' ? 'Review Order' : `Choose your ${currentStep.title.toLowerCase()}`}
                    </h2>
                    <p className="text-muted-foreground">{stepDescriptions[currentStep.id]}</p>
                  </div>
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-between items-center border-t border-border pt-8">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handlePrev} 
                disabled={currentStepIndex === 0}
                className="w-[120px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              <Button 
                variant="premium" 
                size="lg"
                onClick={handleNext}
                className={`min-w-[160px] shadow-lg shadow-accent/20 ${currentStepIndex === STEPS.length - 1 ? 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90' : ''}`}
              >
                {currentStepIndex === STEPS.length - 1 ? (
                  <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart — ₹{finalPrice}</>
                ) : (
                  <>Next <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
