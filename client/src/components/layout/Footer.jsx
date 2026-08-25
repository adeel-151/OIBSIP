import React from 'react';
import { Link } from 'react-router-dom';
import { Pizza } from 'lucide-react';

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
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground rounded-full border-4 border-background flex items-center justify-center hover:bg-primary hover:text-foreground hover:border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a href="#" className="w-12 h-12 bg-background text-foreground rounded-full border-4 border-background flex items-center justify-center hover:bg-primary hover:text-foreground hover:border-foreground shadow-[4px_4px_0px_0px_hsl(var(--background))] hover:shadow-none hover:translate-y-1 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
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
                className="px-4 py-3 rounded-xl bg-background border-4 border-transparent focus:border-primary text-foreground font-bold placeholder:text-muted-foreground outline-none shadow-inner" />
              
               <button className="bg-primary hover:bg-primary/90 text-foreground font-bold text-lg py-3 px-6 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all">
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
    </footer>);

};

export default Footer;