import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { createOrder, verifyPayment } from '../../services/paymentService';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { 
  Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart,
  MapPin, Clock, MessageSquare, Tag, ChevronDown, ChevronUp, Check,
  Truck, Store
} from 'lucide-react';
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

const TIME_SLOTS = [
  { id: 'asap', label: 'ASAP', desc: '25-35 minutes' },
  { id: '30min', label: '30 min', desc: 'In about 30 minutes' },
  { id: '45min', label: '45 min', desc: 'In about 45 minutes' },
  { id: '60min', label: '1 hour', desc: 'In about 1 hour' },
];

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalAmount, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New states
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // delivery | pickup
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: ''
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('asap');
  const [showInstructions, setShowInstructions] = useState(false);

  const subtotal = getTotalAmount();
  const deliveryFee = deliveryMode === 'delivery' ? (subtotal > 0 ? 50 : 0) : 0;
  const totalAmount = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (!couponCode) return;
    
    // Demo coupon logic
    const validCoupons = {
      'PIZZA20': 20,
      'WELCOME50': 50,
      'FLAT100': 100,
    };
    
    const couponDiscount = validCoupons[couponCode.toUpperCase()];
    if (couponDiscount) {
      setDiscount(couponDiscount);
      setCouponApplied(true);
      toast.success(`Coupon applied! ₹${couponDiscount} off`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscount(0);
    toast.success('Coupon removed');
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      navigate('/login?redirect=/cart');
      return;
    }

    if (items.length === 0) return;

    if (deliveryMode === 'delivery') {
      if (!address.street || !address.city) {
        toast.error('Please enter your delivery address');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load. Check your connection.');
        return;
      }

      const orderPayload = {
        items: items.map(item => ({
          pizzaId: item.pizzaId,
          isCustom: item.isCustom || false,
          customIngredients: item.customIngredients || null,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: deliveryMode === 'delivery' ? address : null,
        deliveryMode,
        specialInstructions,
        deliveryTimeSlot: selectedTimeSlot,
        couponCode: couponApplied ? couponCode : null,
        paymentMethod: 'RAZORPAY'
      };

      const orderRes = await createOrder(orderPayload);
      const { order, razorpayOrder } = orderRes;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock_key_here',
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Pizzaro',
        description: 'Premium Pizza Delivery',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
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
          color: '#C6224E' // Primary color
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
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Cart Items */}
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
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.cartItemId} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 flex flex-col sm:flex-row gap-6"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=300'} 
                          alt={item.name} 
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex flex-col flex-grow justify-between">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold font-heading">{item.name}</h3>
                            {item.isCustom ? (
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.customIngredients?.size?.name && `${item.customIngredients.size.name} • `}
                                {item.customIngredients.base?.name}, {item.customIngredients.sauce?.name || 'No sauce'}
                                {item.customIngredients?.meats?.length > 0 && ` + ${item.customIngredients.meats.length} meat(s)`}
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
                </AnimatePresence>
              </div>
            </div>

            {/* Delivery Mode Toggle */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Delivery Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryMode === 'delivery'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Truck className={`w-5 h-5 ${deliveryMode === 'delivery' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className="font-bold text-sm">Delivery</p>
                    <p className="text-xs text-muted-foreground">To your door • ₹50</p>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    deliveryMode === 'pickup'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Store className={`w-5 h-5 ${deliveryMode === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className="font-bold text-sm">Pickup</p>
                    <p className="text-xs text-muted-foreground">From nearest store • Free</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address (only for delivery) */}
            {deliveryMode === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-card rounded-2xl border border-border p-5"
              >
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street address, apt, floor..."
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-1/2 px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Time Slot */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Delivery Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      selectedTimeSlot === slot.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <p className="font-bold text-sm">{slot.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{slot.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full p-5 flex justify-between items-center hover:bg-secondary/30 transition-colors"
              >
                <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Special Instructions
                </span>
                {showInstructions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              <AnimatePresence>
                {showInstructions && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <textarea
                        rows={3}
                        placeholder="E.g., Extra spicy, no onions, ring the doorbell..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold font-heading mb-6 border-b border-border pb-4">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-6">
                {!couponApplied ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-semibold hover:bg-accent/90 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-400">{couponCode.toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">(-₹{discount})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-muted-foreground hover:text-foreground">
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground mt-2">Try: PIZZA20, WELCOME50, FLAT100</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-foreground/80">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-foreground/80">
                  <span>{deliveryMode === 'delivery' ? 'Delivery Charge' : 'Pickup'}</span>
                  <span className="font-medium">
                    {deliveryFee === 0 ? <span className="text-green-400">Free</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold font-heading text-primary">₹{totalAmount}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 text-right">Inclusive of all taxes</p>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3 mb-6">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm">
                  Est. {deliveryMode === 'delivery' ? 'delivery' : 'pickup'}: <span className="font-bold text-foreground">{TIME_SLOTS.find(s => s.id === selectedTimeSlot)?.desc}</span>
                </span>
              </div>

              <Button 
                variant="premium" 
                size="lg" 
                className="w-full rounded-full shadow-lg shadow-primary/20 text-lg h-14"
                onClick={handleCheckout}
                isLoading={isProcessing}
              >
                {!isProcessing && <><ShoppingCart className="w-5 h-5 mr-2" /> Pay ₹{totalAmount}</>}
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
