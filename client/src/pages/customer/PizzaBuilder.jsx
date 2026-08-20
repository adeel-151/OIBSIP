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
import { ArrowLeft, ArrowRight, ShoppingCart, Check } from 'lucide-react';
import SEO from '../../components/SEO';

const STEPS = [
  { id: 'BASE', title: 'Base' },
  { id: 'SAUCE', title: 'Sauce' },
  { id: 'CHEESE', title: 'Cheese' },
  { id: 'VEGETABLE', title: 'Vegetables' },
  { id: 'REVIEW', title: 'Review' }
];

// Fallback ingredients in case backend is empty
const MOCK_INGREDIENTS = [
  { _id: 'b1', name: 'Classic Thin', category: 'BASE', price: 80, image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'b2', name: 'Hand Tossed', category: 'BASE', price: 70, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'b3', name: 'Cheese Burst', category: 'BASE', price: 120, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 's1', name: 'Classic Tomato', category: 'SAUCE', price: 0, image: 'https://images.unsplash.com/photo-1552604617-eea98aa27234?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 's2', name: 'Spicy Marinara', category: 'SAUCE', price: 20, image: 'https://images.unsplash.com/photo-1605646197171-ec3f84856f6c?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'c1', name: 'Mozzarella', category: 'CHEESE', price: 35, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'c2', name: 'Four Cheese', category: 'CHEESE', price: 60, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v1', name: 'Mushrooms', category: 'VEGETABLE', price: 25, image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v2', name: 'Bell Pepper', category: 'VEGETABLE', price: 15, image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v3', name: 'Olives', category: 'VEGETABLE', price: 30, image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=200&h=200' },
  { _id: 'v4', name: 'Jalapeños', category: 'VEGETABLE', price: 20, image: 'https://images.unsplash.com/photo-1596486008688-66d48259d81d?auto=format&fit=crop&q=80&w=200&h=200' },
];

const PizzaBuilder = () => {
  const [searchParams] = useSearchParams();
  const pizzaId = searchParams.get('pizza');
  const navigate = useNavigate();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [allIngredients, setAllIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
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
          base: selectedBase,
          sauce: selectedSauce,
          cheese: selectedCheese,
          vegetables: selectedVegetables
        },
        quantity: 1,
        price: totalPrice
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
    if (currentStep.id === 'REVIEW') {
      return (
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold font-heading mb-6 border-b border-border pb-4">Your Masterpiece</h3>
          <ul className="space-y-4 mb-8 text-foreground/90">
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
          </ul>
        </div>
      );
    }

    const availableIngredients = allIngredients.filter(i => i.category === currentStep.id);

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableIngredients.map(ingredient => {
          let isSelected = false;
          let onClick = () => {};

          if (currentStep.id === 'BASE') {
            isSelected = selectedBase?._id === ingredient._id;
            onClick = () => setBase(ingredient);
          } else if (currentStep.id === 'SAUCE') {
            isSelected = selectedSauce?._id === ingredient._id;
            onClick = () => setSauce(ingredient);
          } else if (currentStep.id === 'CHEESE') {
            isSelected = selectedCheese?._id === ingredient._id;
            onClick = () => setCheese(ingredient);
          } else if (currentStep.id === 'VEGETABLE') {
            isSelected = selectedVegetables.some(v => v._id === ingredient._id);
            onClick = () => toggleVegetable(ingredient);
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-8">
      <SEO title="Pizza Builder" />
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Step Indicator */}
        <div className="mb-12 hidden md:flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -translate-y-1/2 z-0" />
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
              
              <div className="mt-8 w-full border-t border-border pt-6 flex justify-between items-center">
                <div>
                  <span className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Amount</span>
                  <h2 className="text-3xl font-bold font-heading text-primary">₹{totalPrice}</h2>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Dynamic Price<br/>Calculation
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
                    <h2 className="text-3xl font-bold font-heading mb-2">Choose your {currentStep.id.toLowerCase()}</h2>
                    <p className="text-muted-foreground">Select from our premium ingredients.</p>
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
                className={`min-w-[140px] shadow-lg shadow-accent/20 ${currentStepIndex === STEPS.length - 1 ? 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90' : ''}`}
              >
                {currentStepIndex === STEPS.length - 1 ? (
                  <><ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart</>
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
