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
  const [paymentMethod, setPaymentMethod] = useState('COD');

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
      toast.success(`Coupon applied! Rs.${couponDiscount} off`);
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
      if (paymentMethod === 'ONLINE') {
        const res = await loadRazorpayScript();
        if (!res) {
          toast.error('Razorpay SDK failed to load. Check your connection.');
          setIsProcessing(false);
          return;
        }
      }

      const orderPayload = {
        items: items.map(item => {
          const formattedItem = {
            isCustom: item.isCustom || false,
            quantity: item.quantity,
            price: item.price,
            name: item.name,
            image: item.image
          };
          
          if (item.isCustom) {
            formattedItem.customIngredients = {
              base: item.customIngredients?.base?._id || item.customIngredients?.base,
              sauce: item.customIngredients?.sauce?._id || item.customIngredients?.sauce,
              cheese: item.customIngredients?.cheese?._id || item.customIngredients?.cheese,
              vegetables: item.customIngredients?.vegetables?.map(v => v._id || v) || []
            };
          } else {
            formattedItem.pizza = item.pizzaId;
          }
          
          return formattedItem;
        }),
        deliveryAddress: deliveryMode === 'delivery' ? address : null,
        deliveryMode,
        specialInstructions,
        deliveryTimeSlot: selectedTimeSlot,
        couponCode: couponApplied ? couponCode : null,
        paymentMethod
      };

      const orderRes = await createOrder(orderPayload);
      
      if (paymentMethod === 'COD') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/track-order');
        return;
      }

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
            navigate('/track-order');
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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <SEO title="Cart | Pizzaro" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-card p-12 rounded-[3rem] border-4 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] max-w-xl w-full"
        >
          <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] text-foreground">
            <ShoppingBag className="w-16 h-16" />
          </div>
          <h2 className="text-5xl font-['Chewy'] mb-4 text-foreground tracking-wide">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 text-lg font-bold">
            Looks like you haven't added anything to your cart yet. Discover our premium menu or build your own masterpiece.
          </p>
          <Link to="/menu">
            <button className="bg-foreground text-background font-['Chewy'] text-2xl px-10 py-4 rounded-full border-4 border-foreground hover:bg-background hover:text-foreground shadow-[6px_6px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-1 transition-all duration-300">
              Explore Pizzas
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <SEO title="Cart | Pizzaro" />
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="text-5xl md:text-6xl font-['Chewy'] mb-12 text-foreground tracking-wide">Your Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="w-full lg:w-[65%] space-y-8">
            {/* Cart Items */}
            <div className="bg-card rounded-[2rem] border-4 border-foreground overflow-hidden shadow-[8px_8px_0px_0px_hsl(var(--foreground))]">
              <div className="p-6 border-b-4 border-foreground bg-primary flex justify-between items-center">
                <h2 className="font-['Chewy'] text-3xl tracking-wide text-foreground">Order Items ({items.length})</h2>
                <button 
                  onClick={clearCart}
                  className="text-lg text-foreground hover:text-background font-['Chewy'] tracking-wide border-2 border-transparent hover:border-foreground px-3 py-1 rounded-xl transition-all"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="divide-y-4 divide-foreground/10 bg-background">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div 
                      key={item.cartItemId} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-card transition-colors"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-secondary rounded-2xl overflow-hidden flex-shrink-0 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
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
                            <h3 className="text-3xl font-['Chewy'] tracking-wide text-foreground">{item.name}</h3>
                            {item.isCustom ? (
                              <p className="text-sm font-bold text-muted-foreground mt-1">
                                {item.customIngredients?.size?.name && `${item.customIngredients.size.name} • `}
                                {item.customIngredients.base?.name}, {item.customIngredients.sauce?.name || 'No sauce'}
                                {item.customIngredients?.meats?.length > 0 && ` + ${item.customIngredients.meats.length} meat(s)`}
                              </p>
                            ) : (
                              <p className="text-sm font-bold text-muted-foreground mt-1">Classic Menu Item</p>
                            )}
                          </div>
                          <span className="text-2xl font-bold font-['Chewy'] text-primary whitespace-nowrap drop-shadow-sm">Rs.{item.price * item.quantity}</span>
                        </div>

                        <div className="flex justify-between items-center mt-4 sm:mt-0">
                          <div className="flex items-center bg-card rounded-full border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))] p-1">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background text-foreground transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-5 h-5 font-bold" />
                            </button>
                            <span className="w-12 text-center font-bold text-xl">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background text-foreground transition-colors"
                            >
                              <Plus className="w-5 h-5 font-bold" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="p-3 text-muted-foreground hover:text-white hover:bg-red-500 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Delivery Mode Toggle */}
            <div className="bg-card rounded-[2rem] border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
              <h3 className="font-['Chewy'] text-2xl mb-4 tracking-wide text-foreground">Delivery Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryMode('delivery')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-4 transition-all ${
                    deliveryMode === 'delivery'
                      ? 'border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1'
                      : 'border-foreground/20 hover:border-foreground bg-background hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]'
                  }`}
                >
                  <Truck className={`w-8 h-8 ${deliveryMode === 'delivery' ? 'text-foreground' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className={`font-bold text-xl font-['Chewy'] ${deliveryMode === 'delivery' ? 'text-foreground' : 'text-muted-foreground'}`}>Delivery</p>
                    <p className={`text-sm font-bold ${deliveryMode === 'delivery' ? 'text-foreground/80' : 'text-muted-foreground'}`}>To your door • Rs.50</p>
                  </div>
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={`flex items-center gap-4 p-5 rounded-2xl border-4 transition-all ${
                    deliveryMode === 'pickup'
                      ? 'border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1'
                      : 'border-foreground/20 hover:border-foreground bg-background hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]'
                  }`}
                >
                  <Store className={`w-8 h-8 ${deliveryMode === 'pickup' ? 'text-foreground' : 'text-muted-foreground'}`} />
                  <div className="text-left">
                    <p className={`font-bold text-xl font-['Chewy'] ${deliveryMode === 'pickup' ? 'text-foreground' : 'text-muted-foreground'}`}>Pickup</p>
                    <p className={`text-sm font-bold ${deliveryMode === 'pickup' ? 'text-foreground/80' : 'text-muted-foreground'}`}>From nearest store • Free</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Delivery Address (only for delivery) */}
            {deliveryMode === 'delivery' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-card rounded-[2rem] border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]"
              >
                <h3 className="font-['Chewy'] text-2xl mb-4 tracking-wide text-foreground flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Street address, apt, floor..."
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full px-5 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-5 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                  />
                  <div className="flex gap-4">
                    <input
                      type="text"
                      placeholder="State"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="w-full px-5 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="ZIP"
                      value={address.zipCode}
                      onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                      className="w-1/2 px-5 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Time Slot */}
            <div className="bg-card rounded-[2rem] border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
              <h3 className="font-['Chewy'] text-2xl mb-4 tracking-wide text-foreground flex items-center gap-2">
                <Clock className="w-6 h-6" /> Delivery Time
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedTimeSlot(slot.id)}
                    className={`p-4 rounded-2xl border-4 text-center transition-all ${
                      selectedTimeSlot === slot.id
                        ? 'border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1'
                        : 'border-foreground/20 hover:border-foreground bg-background hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]'
                    }`}
                  >
                    <p className={`font-['Chewy'] text-xl tracking-wide ${selectedTimeSlot === slot.id ? 'text-foreground' : 'text-muted-foreground'}`}>{slot.label}</p>
                    <p className={`text-xs font-bold ${selectedTimeSlot === slot.id ? 'text-foreground/80' : 'text-muted-foreground'} mt-1`}>{slot.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            <div className="bg-card rounded-[2rem] border-4 border-foreground overflow-hidden shadow-[6px_6px_0px_0px_hsl(var(--foreground))]">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full p-6 flex justify-between items-center hover:bg-background transition-colors"
              >
                <span className="font-['Chewy'] text-2xl tracking-wide text-foreground flex items-center gap-3">
                  <MessageSquare className="w-6 h-6" /> Special Instructions
                </span>
                {showInstructions ? <ChevronUp className="w-6 h-6 text-foreground font-bold" /> : <ChevronDown className="w-6 h-6 text-foreground font-bold" />}
              </button>
              <AnimatePresence>
                {showInstructions && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <textarea
                        rows={3}
                        placeholder="E.g., Extra spicy, no onions, ring the doorbell..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full px-5 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] resize-none transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column — Order Summary */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-card rounded-[2rem] border-4 border-foreground shadow-[12px_12px_0px_0px_hsl(var(--foreground))] p-8 sticky top-32">
              <h2 className="text-3xl font-['Chewy'] tracking-wide mb-6 border-b-4 border-foreground pb-4 text-foreground">Order Summary</h2>
              
              {/* Coupon Code */}
              <div className="mb-8">
                {!couponApplied ? (
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground font-bold" />
                      <input
                        type="text"
                        placeholder="Coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-background border-4 border-foreground/20 rounded-2xl text-lg font-bold placeholder:text-muted-foreground focus:outline-none focus:border-foreground focus:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                      />
                    </div>
                    <button
                      onClick={handleApplyCoupon}
                      className="px-6 py-4 bg-foreground text-background rounded-2xl text-xl font-['Chewy'] tracking-wide border-4 border-transparent hover:border-foreground hover:bg-primary hover:text-foreground hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))] transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-500 text-white border-4 border-foreground rounded-2xl px-5 py-4 shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 font-bold" />
                      <span className="text-xl font-['Chewy'] tracking-wide">{couponCode.toUpperCase()}</span>
                      <span className="text-sm font-bold opacity-90">(-Rs.{discount})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-sm font-bold hover:underline">
                      Remove
                    </button>
                  </div>
                )}
                <p className="text-xs font-bold text-muted-foreground mt-3 uppercase tracking-wider">Try: PIZZA20, WELCOME50, FLAT100</p>
              </div>
              
              <div className="space-y-4 mb-8 font-bold text-lg">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>{deliveryMode === 'delivery' ? 'Delivery Charge' : 'Pickup'}</span>
                  <span>
                    {deliveryFee === 0 ? <span className="text-primary font-bold">Free</span> : `Rs.${deliveryFee}`}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-500">
                    <span>Coupon Discount</span>
                    <span>-Rs.{discount}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t-4 border-foreground pt-6 mb-8 bg-background p-6 rounded-2xl border-4 shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-['Chewy'] text-foreground tracking-wide">Total</span>
                  <span className="text-4xl font-extrabold font-['Chewy'] text-primary tracking-wide drop-shadow-sm">Rs.{totalAmount}</span>
                </div>
                <p className="text-xs font-bold text-muted-foreground mt-2 text-right">Inclusive of all taxes</p>
              </div>

              {/* Estimated Time */}
              <div className="flex items-center gap-3 bg-primary rounded-2xl px-5 py-4 mb-8 border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--foreground))]">
                <Clock className="w-6 h-6 text-foreground" />
                <span className="text-lg font-['Chewy'] tracking-wide text-foreground">
                  Est. {deliveryMode === 'delivery' ? 'delivery' : 'pickup'}: <span className="font-bold underline">{TIME_SLOTS.find(s => s.id === selectedTimeSlot)?.desc}</span>
                </span>
              </div>
              
              {/* Payment Method Toggle */}
              <div className="bg-card rounded-2xl mb-8">
                <h3 className="font-['Chewy'] text-2xl mb-4 tracking-wide text-foreground">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border-4 text-center transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1'
                        : 'border-foreground/20 hover:border-foreground bg-background hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]'
                    }`}
                  >
                    <span className={`font-['Chewy'] text-xl tracking-wide ${paymentMethod === 'COD' ? 'text-foreground' : 'text-muted-foreground'}`}>COD</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`p-4 rounded-2xl border-4 text-center transition-all ${
                      paymentMethod === 'ONLINE'
                        ? 'border-foreground bg-primary shadow-[4px_4px_0px_0px_hsl(var(--foreground))] -translate-y-1'
                        : 'border-foreground/20 hover:border-foreground bg-background hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_hsl(var(--foreground))]'
                    }`}
                  >
                    <span className={`font-['Chewy'] text-xl tracking-wide ${paymentMethod === 'ONLINE' ? 'text-foreground' : 'text-muted-foreground'}`}>Pay Online</span>
                  </button>
                </div>
              </div>

              <button 
                className="w-full flex items-center justify-center gap-3 bg-foreground text-background hover:bg-background hover:text-foreground border-4 border-foreground rounded-full shadow-[8px_8px_0px_0px_hsl(var(--foreground))] hover:shadow-none hover:translate-y-2 text-2xl font-['Chewy'] tracking-wide py-5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {!isProcessing ? <><ShoppingCart className="w-6 h-6 mr-1" /> {paymentMethod === 'COD' ? 'Place Order' : 'Pay'} Rs.{totalAmount}</> : "Processing..."}
              </button>
              
              {!isAuthenticated && (
                <p className="text-sm font-bold text-center text-muted-foreground mt-6">
                  You'll be asked to <Link to="/login" className="text-primary hover:underline font-['Chewy'] text-lg tracking-wide">login</Link> before checkout.
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
