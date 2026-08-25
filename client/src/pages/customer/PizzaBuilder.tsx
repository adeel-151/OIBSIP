import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useBuilderStore from '../../store/builderStore';
import useCartStore from '../../store/cartStore';
import { getPizzaById } from '../../services/pizzaService';
import { getAllIngredients } from '../../services/ingredientService';
import PizzaPreview from '../../components/pizza/PizzaPreview';
import IngredientCard from '../../components/pizza/IngredientCard';
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {SIZES.map(size => (
            <motion.div
              key={size.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSize(size)}
              className={`relative cursor-pointer rounded-3xl border-4 p-3 sm:p-6 text-center transition-all duration-300 ${
                selectedSize.id === size.id
                  ? 'border-foreground bg-primary shadow-xl shadow-primary/20 scale-105'
                  : 'border-transparent hover:border-foreground bg-background hover:scale-105 shadow-md'
              }`}
            >
              {selectedSize.id === size.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-foreground rounded-full p-1">
                  <Check size={16} className="text-background font-bold" />
                </motion.div>
              )}
              <div className="text-4xl mb-3">{size.icon}</div>
              <h4 className={`font-bold text-xl sm:text-2xl font-['Chewy'] tracking-wide ${selectedSize.id === size.id ? 'text-foreground' : 'text-foreground'}`}>{size.name}</h4>
              <p className={`text-sm font-bold ${selectedSize.id === size.id ? 'text-foreground/80' : 'text-muted-foreground'}`}>{size.size}</p>
              <p className={`text-xs mt-1 font-bold ${selectedSize.id === size.id ? 'text-foreground/80' : 'text-muted-foreground'}`}>{size.serves}</p>
              <div className="mt-4 pt-3 border-t-2 border-foreground/10">
                 <p className={`text-sm font-bold ${selectedSize.id === size.id ? 'text-foreground' : 'text-primary'}`}>
                   {size.multiplier === 1 ? 'Base price' : `${size.multiplier}x price`}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>
      );
    }

    // REVIEW step
    if (currentStep.id === 'REVIEW') {
      return (
        <div className="bg-card border-4 border-foreground rounded-[2rem] p-8 shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
          <h3 className="text-3xl sm:text-4xl font-['Chewy'] text-foreground mb-6 border-b-4 border-foreground pb-4 tracking-wide">Your Masterpiece</h3>
          <ul className="space-y-4 mb-8 text-foreground/90 font-bold">
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Size</span>
                <span className="text-sm text-muted-foreground">{selectedSize.name} ({selectedSize.size})</span>
              </div>
              <span className="text-lg bg-primary px-3 py-1 rounded-lg border-2 border-foreground">{selectedSize.multiplier}x</span>
            </li>
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Base</span>
                <span className="text-sm text-muted-foreground">{selectedBase?.name}</span>
              </div>
              <span className="text-lg">+Rs.{selectedBase?.price}</span>
            </li>
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Sauce</span>
                <span className="text-sm text-muted-foreground">{selectedSauce?.name || 'None'}</span>
              </div>
              <span className="text-lg">+Rs.{selectedSauce?.price || 0}</span>
            </li>
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Cheese</span>
                <span className="text-sm text-muted-foreground">{selectedCheese?.name || 'None'}</span>
              </div>
              <span className="text-lg">+Rs.{selectedCheese?.price || 0}</span>
            </li>
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Vegetables</span>
                <span className="text-sm text-muted-foreground">
                  {selectedVegetables.length > 0 ? selectedVegetables.map(v => v.name).join(', ') : 'None'}
                </span>
              </div>
              <span className="text-lg">
                +Rs.{selectedVegetables.reduce((acc, curr) => acc + curr.price, 0)}
              </span>
            </li>
            <li className="flex justify-between items-center bg-background border-2 border-foreground p-4 rounded-xl shadow-[2px_2px_0px_0px_hsl(var(--foreground))]">
              <div>
                <span className="block text-lg">Meats</span>
                <span className="text-sm text-muted-foreground">
                  {selectedMeats.length > 0 ? selectedMeats.map(m => m.name).join(', ') : 'None'}
                </span>
              </div>
              <span className="text-lg">
                +Rs.{meatTotal}
              </span>
            </li>
          </ul>
          <div className="border-t-4 border-foreground pt-6 flex justify-between items-center bg-primary p-6 rounded-2xl border-4 mt-6 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
            <span className="text-xl sm:text-2xl font-bold font-['Chewy'] tracking-wide">Grand Total</span>
            <span className="text-3xl sm:text-4xl font-extrabold font-['Chewy'] text-foreground tracking-wide">Rs.{finalPrice}</span>
          </div>
        </div>
      );
    }

    // Ingredient selection steps
    const categoryId = currentStep.id;
    const availableIngredients = allIngredients.filter(i => i.category === categoryId);

    if (availableIngredients.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground border-4 border-dashed border-foreground/30 rounded-[2rem]">
          <p className="text-2xl font-['Chewy'] mb-2 text-foreground">No {currentStep.title.toLowerCase()} available</p>
          <p className="font-bold">Skip this step or check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
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
    <div className="min-h-screen bg-background pt-32 pb-24">
      <SEO title="Pizza Builder | Pizzaro" description="Build your perfect custom pizza with premium ingredients." />
      
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="font-['Chewy'] text-5xl sm:text-6xl md:text-7xl text-foreground tracking-wide mb-4">Build Your Pizza</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-bold">Craft the perfect pie with our fresh, artisanal ingredients. The oven is hot and waiting!</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-16 hidden md:flex justify-between relative px-8">
          <div className="absolute top-1/2 left-8 right-8 h-2 bg-foreground/10 -translate-y-1/2 z-0 rounded-full" />
          {/* Progress fill */}
          <div 
            className="absolute top-1/2 left-8 h-2 bg-primary -translate-y-1/2 z-0 transition-all duration-500 rounded-full"
            style={{ width: `calc(${(currentStepIndex / (STEPS.length - 1)) * 100}% - 4rem)` }}
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
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 ${
                  isActive ? 'bg-primary text-foreground scale-110 shadow-xl shadow-primary/20 border-foreground' : 
                  isCompleted ? 'bg-foreground text-background' : 
                  'bg-card text-muted-foreground group-hover:bg-background'
                }`}>
                  {isCompleted ? <Check className="w-6 h-6" /> : `0${index + 1}`}
                </div>
                <span className={`mt-4 text-lg font-['Chewy'] tracking-wide transition-colors ${
                  isActive ? 'text-primary' : 
                  isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left: Interactive Preview */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-32 bg-card border-4 border-foreground rounded-[2.5rem] p-8 shadow-[12px_12px_0px_0px_hsl(var(--foreground))] flex flex-col items-center">
              
              <div className="w-full aspect-square relative mb-6 bg-background rounded-full border-4 border-foreground shadow-inner flex items-center justify-center p-4">
                 <PizzaPreview 
                   base={selectedBase} 
                   sauce={selectedSauce} 
                   cheese={selectedCheese} 
                   vegetables={selectedVegetables} 
                 />
              </div>
              
              {/* Size Badge */}
              <div className="mb-6 px-6 py-2 bg-primary border-4 border-foreground rounded-full text-lg font-bold text-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                {selectedSize.icon} {selectedSize.name} ({selectedSize.size})
              </div>
              
              <div className="w-full border-t-4 border-foreground pt-6 mt-2 flex justify-between items-center">
                <div>
                  <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Total Amount</span>
                  <h2 className="text-3xl sm:text-4xl font-bold font-['Chewy'] text-foreground tracking-wide mt-1">Rs.{finalPrice}</h2>
                </div>
                <div className="text-right text-xs font-bold text-muted-foreground bg-background border-2 border-foreground p-2 rounded-lg">
                  {selectedSize.multiplier !== 1 && (
                    <span className="block text-primary text-sm mb-1">{selectedSize.multiplier}x size mult</span>
                  )}
                  Dynamic Price
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selection Area */}
          <div className="w-full lg:w-[65%]">
            {/* Mobile Step Indicator */}
            <div className="md:hidden mb-8 flex justify-between items-center bg-card p-5 rounded-2xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
              <span className="font-['Chewy'] text-xl text-primary">Step {currentStepIndex + 1} of {STEPS.length}</span>
              <span className="font-bold text-lg">{currentStep.title}</span>
            </div>

            <div className="bg-transparent min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="mb-10 flex flex-col items-start bg-card border-4 border-foreground p-6 rounded-[2rem] shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
                    <h2 className="text-3xl sm:text-4xl font-['Chewy'] text-foreground tracking-wide mb-2 break-words">
                      {currentStep.id === 'REVIEW' ? 'Review Order' : `Choose your ${currentStep.title.toLowerCase()}`}
                    </h2>
                    <p className="text-muted-foreground font-bold text-lg">{stepDescriptions[currentStep.id]}</p>
                  </div>
                  
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-16 flex justify-between items-center">
              <button 
                onClick={handlePrev} 
                disabled={currentStepIndex === 0}
                className={`w-[140px] flex items-center justify-center gap-2 px-6 py-4 rounded-full font-bold text-xl tracking-wide border-2 transition-all duration-300 ${currentStepIndex === 0 ? 'opacity-50 cursor-not-allowed bg-background border-transparent text-foreground' : 'bg-background hover:bg-foreground hover:text-background text-foreground border-transparent hover:border-foreground shadow-md hover:scale-105'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Back
              </button>
              <button 
                onClick={handleNext}
                className={`min-w-[180px] flex items-center justify-center gap-3 px-10 py-4 rounded-full font-bold text-xl tracking-wide transition-all duration-300 ${currentStepIndex === STEPS.length - 1 ? 'bg-primary text-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-105' : 'bg-foreground text-background shadow-xl hover:scale-105'}`}
              >
                {currentStepIndex === STEPS.length - 1 ? (
                  <><ShoppingCart className="w-6 h-6 mr-1" /> Add to Cart</>
                ) : (
                  <>Next Step <ArrowRight className="w-5 h-5 ml-1" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
