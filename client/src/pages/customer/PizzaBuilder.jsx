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
import styles from './Builder.module.css';
import { toast } from 'sonner';

const STEPS = [
  { id: 'BASE', title: '01 Base' },
  { id: 'SAUCE', title: '02 Sauce' },
  { id: 'CHEESE', title: '03 Cheese' },
  { id: 'VEGETABLE', title: '04 Vegetables' },
  { id: 'REVIEW', title: '05 Review' }
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

  useEffect(() => {
    const init = async () => {
      try {
        const ingredientsRes = await getAllIngredients();
        setAllIngredients(ingredientsRes.data);

        if (pizzaId) {
          const pizzaRes = await getPizzaById(pizzaId);
          initializeBuilder(pizzaRes.data);
        } else {
          resetBuilder(); // Start fresh
        }
      } catch (error) {
        toast.error('Failed to load ingredients.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [pizzaId]);

  const currentStep = STEPS[currentStepIndex];

  const { items, addToCart } = useCartStore();

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      // Validate step
      if (currentStep.id === 'BASE' && !selectedBase) {
        toast.error('Please select a base to continue');
        return;
      }
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Add to cart
      const cartItem = {
        pizzaId,
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
        <div className={styles.reviewSection}>
          <h3>Your Custom Pizza</h3>
          <ul className={styles.reviewList}>
            <li><strong>Base:</strong> {selectedBase?.name} (+₹{selectedBase?.price})</li>
            <li><strong>Sauce:</strong> {selectedSauce?.name || 'None'} (+₹{selectedSauce?.price || 0})</li>
            <li><strong>Cheese:</strong> {selectedCheese?.name || 'None'} (+₹{selectedCheese?.price || 0})</li>
            <li>
              <strong>Vegetables:</strong> {selectedVegetables.length > 0 ? selectedVegetables.map(v => v.name).join(', ') : 'None'} 
              (+₹{selectedVegetables.reduce((acc, curr) => acc + curr.price, 0)})
            </li>
          </ul>
        </div>
      );
    }

    const availableIngredients = allIngredients.filter(i => i.category === currentStep.id);

    return (
      <div className={styles.ingredientGrid}>
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
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.builderContainer}`}>
      <div className={styles.layout}>
        {/* Left: Interactive Preview */}
        <div className={styles.previewPane}>
          <div className={styles.previewSticky}>
            <PizzaPreview 
              base={selectedBase} 
              sauce={selectedSauce} 
              cheese={selectedCheese} 
              vegetables={selectedVegetables} 
            />
            
            <div className={styles.priceTag}>
              <span>Total:</span>
              <h2>₹{totalPrice}</h2>
            </div>
          </div>
        </div>

        {/* Right: Steps & Selection */}
        <div className={styles.selectionPane}>
          
          <div className={styles.stepIndicator}>
            {STEPS.map((step, index) => (
              <div 
                key={step.id} 
                className={`${styles.step} ${index === currentStepIndex ? styles.activeStep : ''} ${index < currentStepIndex ? styles.completedStep : ''}`}
                onClick={() => index < currentStepIndex && setCurrentStepIndex(index)}
              >
                {step.title}
              </div>
            ))}
          </div>

          <div className={styles.contentArea}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className={styles.stepTitle}>Choose your {currentStep.id.toLowerCase()}</h2>
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className={styles.navigation}>
            <Button 
              variant="secondary" 
              onClick={handlePrev} 
              disabled={currentStepIndex === 0}
            >
              Back
            </Button>
            <Button 
              variant="premium" 
              onClick={handleNext}
            >
              {currentStepIndex === STEPS.length - 1 ? 'Add to Cart' : 'Next'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PizzaBuilder;
