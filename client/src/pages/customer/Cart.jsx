import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { createOrder, verifyPayment } from '../../services/paymentService';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';

// Utility to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getTotalAmount();
  const deliveryFee = subtotal > 0 ? 50 : 0; // ₹50 delivery fee
  const totalAmount = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      navigate('/login?redirect=/cart');
      return;
    }

    if (items.length === 0) return;

    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        return;
      }

      // 1. Create order on our backend
      const orderPayload = {
        items: items.map(item => ({
          pizzaId: item.pizzaId,
          isCustom: item.isCustom || false,
          customIngredients: item.customIngredients || null,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: {
          street: '123 Pizza Lane',
          city: 'Mumbai',
          state: 'MH',
          zipCode: '400001'
        },
        paymentMethod: 'RAZORPAY'
      };

      const orderRes = await createOrder(orderPayload);
      const { order, razorpayOrder } = orderRes;

      // 2. Configure Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key_here',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Pizzaro',
        description: 'Premium Pizza Delivery',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            await verifyPayment({
              orderId: order._id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            });
            
            clearCart();
            toast.success('Payment successful! Order placed.');
            navigate('/dashboard');
          } catch (error) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || '9999999999'
        },
        theme: {
          color: '#E53935' // Tomato Red
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col items-center justify-center p-4">
        <SEO title="Cart" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold font-heading mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Discover our premium menu or build your own masterpiece.
          </p>
          <Link to="/menu">
            <Button size="lg" variant="premium" className="rounded-full shadow-lg shadow-primary/20 px-8">
              Explore Pizzas
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background py-12">
      <SEO title="Cart" />
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold font-heading mb-8">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border bg-secondary/30 flex justify-between items-center">
                <h2 className="font-bold text-lg">Order Items ({items.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-destructive hover:underline font-medium"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <motion.div 
                    key={item.cartItemId} 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6 flex flex-col sm:flex-row gap-6"
                  >
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300'} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex flex-col flex-grow justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold font-heading">{item.name}</h3>
                          {item.isCustom ? (
                            <p className="text-sm text-muted-foreground mt-1">
                              Custom Build: {item.customIngredients.base?.name}, {item.customIngredients.sauce?.name || 'No sauce'}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">Classic Menu Item</p>
                          )}
                        </div>
                        <span className="text-lg font-bold text-primary whitespace-nowrap">₹{item.price * item.quantity}</span>
                      </div>

                      <div className="flex justify-between items-center mt-4 sm:mt-0">
                        <div className="flex items-center bg-secondary rounded-full border border-border p-1">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold font-heading mb-6 border-b border-border pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Delivery Charge</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">-₹0</span>
                </div>
              </div>
              
              <div className="border-t border-border pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold font-heading text-primary">₹{totalAmount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Inclusive of all taxes</p>
              </div>

              <Button 
                variant="premium" 
                size="lg" 
                className="w-full rounded-full shadow-lg shadow-primary/20 text-lg h-14"
                onClick={handleCheckout}
                isLoading={isProcessing}
              >
                {!isProcessing && <><ShoppingCart className="w-5 h-5 mr-2" /> Proceed to Payment</>}
              </Button>
              
              {!isAuthenticated && (
                <p className="text-sm text-center text-muted-foreground mt-4">
                  You'll be asked to <Link to="/login" className="text-primary hover:underline">login</Link> before checkout.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
