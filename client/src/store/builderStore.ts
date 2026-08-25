import { create } from 'zustand';

const useBuilderStore = create((set, get) => ({
  // Core Selection State
  pizzaId: null, // The original preset pizza ID if they started from Menu
  basePrice: 0, // Starts with base price
  selectedBase: null,
  selectedSauce: null,
  selectedCheese: null,
  selectedVegetables: [],

  // Computed Values
  totalPrice: 0,
  
  // Actions
  initializeBuilder: (pizza) => {
    // pizza has: { _id, basePrice, ingredients: [...] }
    const base = pizza.ingredients.find(i => i.category === 'BASE');
    const sauce = pizza.ingredients.find(i => i.category === 'SAUCE');
    const cheese = pizza.ingredients.find(i => i.category === 'CHEESE');
    const veggies = pizza.ingredients.filter(i => i.category === 'VEGETABLE');
    
    set({
      pizzaId: pizza._id,
      basePrice: pizza.basePrice,
      selectedBase: base || null,
      selectedSauce: sauce || null,
      selectedCheese: cheese || null,
      selectedVegetables: veggies || [],
    });
    get().calculateTotal();
  },

  setBase: (base) => {
    set({ selectedBase: base });
    get().calculateTotal();
  },

  setSauce: (sauce) => {
    set({ selectedSauce: sauce });
    get().calculateTotal();
  },

  setCheese: (cheese) => {
    set({ selectedCheese: cheese });
    get().calculateTotal();
  },

  toggleVegetable: (veggie) => {
    const { selectedVegetables } = get();
    const isSelected = selectedVegetables.some(v => v._id === veggie._id);
    
    if (isSelected) {
      set({ selectedVegetables: selectedVegetables.filter(v => v._id !== veggie._id) });
    } else {
      set({ selectedVegetables: [...selectedVegetables, veggie] });
    }
    get().calculateTotal();
  },

  calculateTotal: () => {
    const { basePrice, selectedBase, selectedSauce, selectedCheese, selectedVegetables } = get();
    
    let total = basePrice;
    if (selectedBase) total += selectedBase.price;
    if (selectedSauce) total += selectedSauce.price;
    if (selectedCheese) total += selectedCheese.price;
    
    selectedVegetables.forEach(veg => {
      total += veg.price;
    });
    
    set({ totalPrice: total });
  },
  
  resetBuilder: () => {
    set({
      pizzaId: null,
      basePrice: 0,
      selectedBase: null,
      selectedSauce: null,
      selectedCheese: null,
      selectedVegetables: [],
      totalPrice: 0
    });
  }
}));

export default useBuilderStore;
