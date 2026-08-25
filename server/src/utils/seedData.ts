import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import Pizza from '../models/Pizza';
import Ingredient from '../models/Ingredient';
import User from '../models/User';
import bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ingredients = [
  { name: 'Classic Thin', category: 'BASE', price: 0, image: 'base-thin.png' },
  { name: 'Hand Tossed', category: 'BASE', price: 100, image: 'base-hand.png' },
  { name: 'Cheese Burst', category: 'BASE', price: 300, image: 'base-cheese.png' },
  { name: 'Whole Wheat', category: 'BASE', price: 150, image: 'base-wheat.png' },
  { name: 'Italian Herb', category: 'BASE', price: 200, image: 'base-herb.png' },
  
  { name: 'Classic Tomato', category: 'SAUCE', price: 0, image: 'sauce-tomato.png' },
  { name: 'Spicy Marinara', category: 'SAUCE', price: 50, image: 'sauce-spicy.png' },
  { name: 'Creamy Garlic', category: 'SAUCE', price: 80, image: 'sauce-garlic.png' },
  { name: 'BBQ', category: 'SAUCE', price: 80, image: 'sauce-bbq.png' },
  { name: 'Pesto', category: 'SAUCE', price: 100, image: 'sauce-pesto.png' },
  
  { name: 'Mozzarella', category: 'CHEESE', price: 0, image: 'cheese-mozzarella.png' },
  { name: 'Cheddar', category: 'CHEESE', price: 150, image: 'cheese-cheddar.png' },
  { name: 'Parmesan', category: 'CHEESE', price: 200, image: 'cheese-parmesan.png' },
  { name: 'Four Cheese', category: 'CHEESE', price: 300, image: 'cheese-four.png' },
  { name: 'Vegan Cheese', category: 'CHEESE', price: 250, image: 'cheese-vegan.png' },
  
  { name: 'Mushrooms', category: 'VEGETABLE', price: 100, image: 'veg-mushroom.png' },
  { name: 'Onions', category: 'VEGETABLE', price: 50, image: 'veg-onion.png' },
  { name: 'Bell Pepper', category: 'VEGETABLE', price: 80, image: 'veg-bell.png' },
  { name: 'Olives', category: 'VEGETABLE', price: 120, image: 'veg-olive.png' },
  { name: 'Jalapeños', category: 'VEGETABLE', price: 100, image: 'veg-jalapeno.png' },
  { name: 'Tomatoes', category: 'VEGETABLE', price: 50, image: 'veg-tomato.png' },
  { name: 'Corn', category: 'VEGETABLE', price: 80, image: 'veg-corn.png' },
  { name: 'Spinach', category: 'VEGETABLE', price: 100, image: 'veg-spinach.png' },
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    await Pizza.deleteMany();
    await Ingredient.deleteMany();
    
    // Seed Ingredients
    const createdIngredients = await Ingredient.insertMany(ingredients);
    console.log('Ingredients seeded!');
    
    // Helper to get ingredient ID by name
    const getIngId = (name) => createdIngredients.find(ing => ing.name === name)._id;

    // Seed Pizzas
    const pizzas = [
      {
        name: 'Classic Margherita',
        description: 'A timeless classic with tomato sauce, mozzarella cheese, and fresh basil.',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
        basePrice: 999,
        category: 'CLASSIC' as 'CLASSIC',
        rating: 4.8,
        isFeatured: true,
        ingredients: [getIngId('Classic Thin'), getIngId('Classic Tomato'), getIngId('Mozzarella')]
      },
      {
        name: 'Spicy Pepperoni',
        description: 'Loaded with spicy pepperoni slices and extra mozzarella.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
        basePrice: 1499,
        category: 'PREMIUM',
        rating: 4.9,
        isFeatured: true,
        ingredients: [getIngId('Hand Tossed'), getIngId('Spicy Marinara'), getIngId('Mozzarella'), getIngId('Jalapeños')]
      },
      {
        name: 'Garden Supreme',
        description: 'A vegetarian delight with mushrooms, bell peppers, onions, and olives.',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
        basePrice: 1199,
        category: 'CLASSIC' as 'CLASSIC',
        rating: 4.6,
        isFeatured: true,
        ingredients: [getIngId('Whole Wheat'), getIngId('Classic Tomato'), getIngId('Mozzarella'), getIngId('Mushrooms'), getIngId('Bell Pepper'), getIngId('Onions'), getIngId('Olives')]
      },
      {
        name: 'BBQ Chicken (Mock)',
        description: 'Sweet and smoky BBQ sauce with chicken (mock meat) and red onions.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        basePrice: 1699,
        category: 'PREMIUM',
        rating: 4.7,
        isFeatured: false,
        ingredients: [getIngId('Cheese Burst'), getIngId('BBQ'), getIngId('Cheddar'), getIngId('Onions')]
      }
    ];

    for (const pizzaData of pizzas) {
      await Pizza.create(pizzaData);
    }
    console.log('Pizzas seeded!');
    
    // Seed Admin (Using User model now)
    const adminExists = await User.findOne({ email: 'admin@pizzaro.com' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash('admin123', salt); // User schema uses 'password'
      await User.create({
        name: 'Super Admin',
        email: 'admin@pizzaro.com',
        password,
        role: 'ADMIN' as 'ADMIN' // User schema uses 'role' string which can be 'admin'
      });
      console.log('Admin seeded!');
    }

    console.log('Data seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data seeding', error);
    process.exit(1);
  }
};

seedData();
