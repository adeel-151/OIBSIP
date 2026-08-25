import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const { items } = get();
        // Generates a unique ID for the cart item, especially important for custom pizzas
        const cartItemId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        set({
          items: [...items, { ...item, cartItemId }]
        });
      },

      removeFromCart: (cartItemId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.cartItemId !== cartItemId)
        });
      },

      updateQuantity: (cartItemId, quantity) => {
        const { items } = get();
        if (quantity < 1) return;

        set({
          items: items.map((item) =>
          item.cartItemId === cartItemId ?
          { ...item, quantity } :
          item
          )
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalAmount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    }),
    {
      name: 'pizzaro-cart-storage'
    }
  )
);

export default useCartStore;