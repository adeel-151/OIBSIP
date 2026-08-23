import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background pt-20 pb-10 border-t-8 border-primary relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute top-10 right-10 text-background/5 rotate-45 pointer-events-none">
        <Pizza size={150} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 left-10 text-primary/10 -rotate-12 pointer-events-none">
        <Pizza size={120} fill="currentColor" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 hover:scale-105 transition-transform origin-left">
              <div className="bg-primary p-2 rounded-xl border-4 border-background shadow-[4px_4px_0px_0px_hsl(var(--background))]">
                <Pizza className="h-8 w-8 text-foreground" />
              </div>
              <span className="text-4xl font-['Chewy'] tracking-wide text-background">PIZZARO</span>
            </Link>
            <p className="text-background/80 text-lg font-bold mb-8 max-w-xs leading-relaxed">
              Crafted Your Way. A premium pizza platform where you don't simply order pizza — you create your own masterpiece.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-background text-foreground rounded-full border-4 border-background flex items-center justify-center hover:bg-primary hover:text-foreground hover:border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                <Twitter className="w-5 h-5 fill-current" />
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground rounded-full border-4 border-background flex items-center justify-center hover:bg-primary hover:text-foreground hover:border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground rounded-full border-4 border-background flex items-center justify-center hover:bg-primary hover:text-foreground hover:border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                <Facebook className="w-5 h-5 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-['Chewy'] text-2xl tracking-wide text-primary mb-6">Menu</h3>
            <ul className="space-y-4 font-bold text-lg text-background/80">
              <li><Link to="/menu" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Classic Pizzas</Link></li>
              <li><Link to="/build" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Build Your Own</Link></li>
              <li><Link to="/menu" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Sides & Drinks</Link></li>
              <li><Link to="/menu" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Special Offers</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-['Chewy'] text-2xl tracking-wide text-primary mb-6">Company</h3>
            <ul className="space-y-4 font-bold text-lg text-background/80">
              <li><Link to="/about" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">About Us</Link></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Careers</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Stores</a></li>
              <li><a href="#" className="hover:text-primary hover:translate-x-2 inline-block transition-transform">Contact</a></li>
            </ul>
          </div>

          {/* Contact / Newsletter */}
          <div>
            <h3 className="font-['Chewy'] text-2xl tracking-wide text-primary mb-6">Stay Hungry</h3>
            <p className="text-background/80 font-bold mb-4">Subscribe for hot deals and secret menu drops!</p>
            <div className="flex flex-col gap-3">
               <input 
                 type="email" 
                 placeholder="Enter your email" 
                 className="px-4 py-3 rounded-xl bg-background border-4 border-transparent focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none shadow-inner"
               />
               <button className="bg-primary text-foreground font-['Chewy'] text-xl py-3 rounded-xl border-4 border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                 Subscribe
               </button>
            </div>
          </div>
        </div>

        <div className="border-t-4 border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-background/60">
          <p>&copy; {new Date().getFullYear()} Pizzaro. All rights reserved.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-primary">Terms</a>
             <a href="#" className="hover:text-primary">Privacy</a>
             <a href="#" className="hover:text-primary">Cookies</a>
          </div>
          <div className="flex items-center gap-2">
            <span>Baked with</span>
            <span className="text-primary text-lg">♥</span>
            <span>for pizza lovers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
