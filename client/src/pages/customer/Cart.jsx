import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';
import styles from './Cart.module.css';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/cart');
      return;
    }

    if (items.length === 0) return;

    try {
      const formattedItems = items.map(item => ({
        pizza: item.pizzaId,
        isCustom: item.isCustom,
        customIngredients: item.customIngredients ? {
          base: item.customIngredients.base?._id,
          sauce: item.customIngredients.sauce?._id,
          cheese: item.customIngredients.cheese?._id,
          vegetables: item.customIngredients.vegetables?.map(v => v._id) || []
        } : undefined,
        quantity: item.quantity,
        price: item.price
      }));

      // Simulate placing an order - using COD for now since Razorpay needs client key
      const response = await api.post('/orders', {
        items: formattedItems,
        totalAmount: getTotalAmount(),
        paymentMethod: 'COD',
        deliveryAddress: {
          street: '123 Main St',
          city: 'Mumbai',
          state: 'MH',
          zipCode: '400001',
          phone: '9999999999'
        }
      });

      if (response.data.success) {
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Failed to place order.');
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className={`container ${styles.emptyCart}`}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any pizzas yet.</p>
          <Link to="/menu">
            <Button variant="premium">Explore Menu</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`container ${styles.cartContainer}`}>
      <h1 className={styles.title}>Your Cart</h1>
      
      <div className={styles.layout}>
        <div className={styles.itemsList}>
          {items.map((item) => (
            <motion.div 
              key={item.cartItemId} 
              className={styles.cartItem}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className={styles.itemInfo}>
                <h3>{item.isCustom ? 'Custom Pizza' : 'Pizza'}</h3>
                {item.isCustom && (
                  <p className={styles.itemDetails}>
                    {item.customIngredients.base?.name}, {item.customIngredients.sauce?.name}
                    {item.customIngredients.vegetables?.length > 0 && 
                      `, +${item.customIngredients.vegetables.length} veggies`
                    }
                  </p>
                )}
                <div className={styles.price}>₹{item.price}</div>
              </div>
              
              <div className={styles.itemActions}>
                <div className={styles.quantityControls}>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                </div>
                <button 
                  className={styles.removeBtn}
                  onClick={() => removeFromCart(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{getTotalAmount()}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Delivery</span>
            <span>Free</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.totalRow}`}>
            <span>Total</span>
            <span>₹{getTotalAmount()}</span>
          </div>
          
          <Button 
            variant="premium" 
            fullWidth 
            onClick={handleCheckout}
            className={styles.checkoutBtn}
          >
            Checkout ({items.length} items)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
