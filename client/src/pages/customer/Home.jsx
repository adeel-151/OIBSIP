import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Button from '../../components/ui/Button';

// Unsplash Images
const HERO_PIZZA = 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop';
const FEATURED_PIZZA = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop';
const MENU_PIZZA = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=500&auto=format&fit=crop';
const MENU_PASTA = 'https://images.unsplash.com/photo-1621996316585-8837db1fe278?q=80&w=500&auto=format&fit=crop';
const MENU_BURGER = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop';
const MENU_SANDWICH = 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=500&auto=format&fit=crop';
const COOKIES = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=500&auto=format&fit=crop';

const Home = () => {
  return (
    <div className="min-h-screen font-sans bg-background">
      
      {/* 1. HERO SECTION (Dark) */}
      <section className="relative w-full bg-foreground pt-28 pb-32 text-background overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-10 right-20 opacity-30 text-primary">
          <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="transform -rotate-45">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 1 8.3C19.2 15.3 14.7 20 11 20Z"/>
            <path d="M11 20c2.2 0 4-1.8 4-4L9.5 9.5"/>
          </svg>
        </div>
        <div className="absolute top-40 right-1/2 opacity-20">
          <div className="w-16 h-16 bg-primary rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Text */}
          <div className="md:w-1/2 space-y-6 z-10">
            <p className="text-primary font-['Chewy'] tracking-wide text-2xl uppercase">
              Taste The Best
            </p>
            <h1 className="font-['Chewy'] text-6xl md:text-8xl leading-none text-background drop-shadow-lg tracking-wide">
              PIZZARO
              <br />
              ORIGINALS
            </h1>
            <p className="text-background/80 max-w-md text-lg leading-relaxed pt-4">
              Experience the authentic taste of Italy with our hand-crafted, wood-fired pizzas. 
              Fresh ingredients, secret recipes, and a whole lot of love in every slice.
            </p>
            <div className="pt-6">
              <Link to="/menu">
                <button className="bg-primary hover:bg-primary/90 text-foreground font-bold text-lg px-8 py-4 rounded-full transition-transform hover:scale-105 shadow-xl shadow-primary/20">
                  ORDER NOW
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
             <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-10 scale-75"></div>
             <img 
               src={HERO_PIZZA} 
               alt="Wood-fired Pizza" 
               className="relative z-10 w-[90%] max-w-[600px] object-cover rounded-full shadow-2xl ring-8 ring-background/10 transform rotate-3"
             />
          </div>
        </div>
      </section>

      {/* 2. OVERLAPPING INFO CARDS */}
      <section className="relative z-20 -mt-16 bg-gradient-to-b from-foreground 50% to-background 50%">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row shadow-2xl">
            
            {/* Card 1: Mauve/Purple Split */}
            <div className="flex-1 flex text-white">
              <div className="bg-[#947883] p-8 w-1/2">
                <h3 className="font-['Chewy'] text-3xl mb-4 text-[#FFF6EA] tracking-wide">Our Story</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Authentic recipes passed down through generations.
                </p>
              </div>
              <div className="bg-[#AF8795] p-8 w-1/2">
                <h3 className="font-['Chewy'] text-3xl mb-4 text-[#FFF6EA] tracking-wide">Quality</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  We use only the freshest, locally sourced ingredients.
                </p>
              </div>
            </div>

            {/* Card 2: Light Yellow */}
            <div className="flex-1 bg-[#FDD05B] p-8 text-black flex flex-col justify-center">
              <h3 className="font-['Chewy'] text-4xl mb-3 tracking-wide">Fast Delivery</h3>
              <p className="text-sm font-medium opacity-80 leading-relaxed">
                Hot and fresh to your door in under 30 minutes, guaranteed.
              </p>
            </div>

            {/* Card 3: Gold */}
            <div className="w-32 bg-[#EBB336] p-6 text-black flex items-center justify-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED SECTION (Light Cream) */}
      <section className="bg-background py-24 w-full relative">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col-reverse md:flex-row items-center gap-16">
          
          {/* Left: Image */}
          <div className="md:w-1/2 relative flex justify-center">
            {/* Decorative items */}
            <div className="absolute -top-10 -left-10 w-20 h-20 opacity-30 text-red-500">
               <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <img 
              src={FEATURED_PIZZA} 
              alt="Specialty Pizza" 
              className="w-[85%] max-w-[550px] object-cover rounded-full shadow-xl ring-8 ring-foreground/5 transform -rotate-6"
            />
          </div>

          {/* Right: Text */}
          <div className="md:w-1/2 space-y-6">
            <p className="text-primary font-['Chewy'] tracking-wide text-2xl uppercase">
              Delicious
            </p>
            <h2 className="font-['Chewy'] text-6xl md:text-7xl text-foreground leading-tight tracking-wide">
              Slow-baked <br/> Specialties
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md pt-2">
              Our signature dough is fermented for 48 hours to ensure a light, airy, and easily digestible crust that crisps perfectly in our wood-fired oven.
            </p>
            <div className="pt-6 flex gap-4">
              <Link to="/menu">
                <button className="bg-primary hover:bg-primary/90 text-foreground font-bold text-lg px-8 py-3 rounded-full transition-transform hover:scale-105 shadow-md">
                  Order Now
                </button>
              </Link>
              <Link to="/build">
                <button className="bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold text-lg px-8 py-3 rounded-full transition-colors">
                  Build Your Own
                </button>
              </Link>
            </div>
          </div>
          
        </div>
      </section>

      {/* 3.5 FRESH INGREDIENTS SECTION (Light Cream) */}
      <section className="bg-background pb-24 w-full relative">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-16">
          
          {/* Left: Text */}
          <div className="md:w-1/2 space-y-6">
            <p className="text-red-500 font-['Chewy'] tracking-wide text-2xl uppercase">
              Farm to Table
            </p>
            <h2 className="font-['Chewy'] text-5xl md:text-6xl text-foreground leading-tight tracking-wide">
              Locally Sourced, <br/> Crafted with Love
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md pt-2">
              Every morning, we source the freshest basil, ripest tomatoes, and the highest quality mozzarella from local farms. It's the secret behind that perfect Pizzaro bite.
            </p>
            <div className="pt-4">
              <Link to="/about">
                <button className="bg-transparent border-2 border-red-500 hover:bg-red-500 hover:text-white text-red-500 font-bold text-lg px-8 py-3 rounded-full transition-colors">
                  Learn More
                </button>
              </Link>
            </div>
          </div>

          {/* Right: Image */}
          <div className="md:w-1/2 relative flex justify-center">
            <div className="absolute inset-0 bg-red-500 rounded-[3rem] blur-3xl opacity-10 scale-90 translate-x-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1200&auto=format&fit=crop" 
              alt="Fresh Ingredients" 
              className="relative z-10 w-full max-w-[500px] h-[400px] object-cover rounded-[3rem] shadow-xl"
            />
          </div>
          
        </div>
      </section>

      {/* 4. PRODUCT GRID (Light Cream) */}
      <section className="bg-background pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Product 1 */}
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col group border border-border/50">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <div className="absolute top-2 left-2 bg-foreground text-background font-['Chewy'] px-3 py-1 rounded-full text-sm z-10">Popular</div>
                <img src={MENU_PIZZA} alt="Margherita" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground">Margherita</h3>
              <p className="text-muted-foreground text-sm mt-2 mb-6 flex-grow">Classic tomato sauce, fresh mozzarella, and basil.</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-foreground">$14.00</span>
                <button className="bg-primary p-2 rounded-xl hover:bg-primary/90 text-foreground transition-colors shadow-sm">
                   <ShoppingCart size={20} />
                </button>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col group border border-border/50">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <div className="absolute top-2 left-2 bg-primary text-foreground font-['Chewy'] px-3 py-1 rounded-full text-sm z-10">New</div>
                <img src={MENU_PASTA} alt="Pasta" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground">Penne Arrabiata</h3>
              <p className="text-muted-foreground text-sm mt-2 mb-6 flex-grow">Spicy tomato sauce with garlic and fresh herbs.</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-foreground">$12.50</span>
                <button className="bg-primary p-2 rounded-xl hover:bg-primary/90 text-foreground transition-colors shadow-sm">
                   <ShoppingCart size={20} />
                </button>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col group border border-border/50">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <div className="absolute top-2 left-2 bg-red-500 text-white font-['Chewy'] px-3 py-1 rounded-full text-sm z-10">Spicy</div>
                <img src={MENU_BURGER} alt="Burger" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground">Pizzaro Burger</h3>
              <p className="text-muted-foreground text-sm mt-2 mb-6 flex-grow">Beef patty with melted pizza cheese and pepperoni.</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-foreground">$11.00</span>
                <button className="bg-primary p-2 rounded-xl hover:bg-primary/90 text-foreground transition-colors shadow-sm">
                   <ShoppingCart size={20} />
                </button>
              </div>
            </div>

            {/* Product 4 */}
            <div className="bg-card rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col group border border-border/50">
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                <img src={MENU_SANDWICH} alt="Sandwich" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-['Chewy'] text-3xl text-foreground">Italian Sub</h3>
              <p className="text-muted-foreground text-sm mt-2 mb-6 flex-grow">Salami, prosciutto, fresh greens, and vinaigrette.</p>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold text-xl text-foreground">$9.50</span>
                <button className="bg-primary p-2 rounded-xl hover:bg-primary/90 text-foreground transition-colors shadow-sm">
                   <ShoppingCart size={20} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FOOTER OVERLAP SECTION */}
      <section className="bg-foreground pt-24 pb-12 relative text-background">
        {/* Floating Card */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-12 w-[90%] max-w-2xl bg-card rounded-2xl p-6 shadow-xl flex items-center justify-between text-foreground border-2 border-border/50">
          <div className="flex items-center gap-4">
            <img src={COOKIES} alt="Cookie" className="w-16 h-16 rounded-full object-cover ring-4 ring-background shadow-md" />
            <div>
              <h4 className="font-['Chewy'] text-2xl">Sweet Tooth?</h4>
              <p className="text-sm font-medium">Add fresh baked cookies to your order!</p>
            </div>
          </div>
          <button className="bg-foreground hover:bg-foreground/90 text-background px-6 py-2 rounded-full font-bold text-sm transition-colors">
            View Desserts
          </button>
        </div>

        <div className="container mx-auto px-6 text-center pt-8">
           <h2 className="font-['Chewy'] text-5xl mb-4 text-primary">Pizzaro</h2>
           <p className="text-background/60 max-w-md mx-auto">
             Delivering happiness, one slice at a time. Thank you for choosing the best pizza in town!
           </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
