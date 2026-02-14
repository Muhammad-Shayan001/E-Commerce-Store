import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Shield, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../App.js';
import ProductCard from '../components/ProductCard.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const { products } = useAppContext();
  const featured = products.filter(p => p.featured).slice(0, 4);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelector('.hero-content'), 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" }
      );
      
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="parallax-bg absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center hero-content">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full bg-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-widest mb-6 border border-primary-500/30"
          >
            Crafting Perfection since 2024
          </motion.span>
          <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            REDEFINE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-500">CREATIONS</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            Discover our curated collection of professional baking supplies, premium chocolates, and artisanal decor.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              to="/shop"
              className="px-10 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all transform hover:scale-105 shadow-2xl"
            >
              Shop Atelier
            </Link>
            <Link 
              to="/shop"
              className="px-10 py-5 bg-white/10 text-white backdrop-blur-md border border-white/20 rounded-full font-black uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Our Heritage
            </Link>
          </div>
        </div>

        {/* Floating elements animation */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full" 
            />
          </div>
        </motion.div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { icon: <Zap className="mx-auto mb-4 text-primary-500" />, label: "Express Delivery", desc: "Fresh arrival" },
              { icon: <Shield className="mx-auto mb-4 text-primary-500" />, label: "Food Grade", desc: "100% Certified" },
              { icon: <Globe className="mx-auto mb-4 text-primary-500" />, label: "Global Sourcing", desc: "Ethical supplies" },
              { icon: <Star className="mx-auto mb-4 text-primary-500" />, label: "Chef Approved", desc: "Pro-tested quality" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {item.icon}
                <h3 className="font-bold text-lg mb-1">{item.label}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white dark:bg-[#0f1115]">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-primary-500 font-bold uppercase tracking-widest text-xs">Baker's Choice</span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 tracking-tighter">ESSENTIAL SUPPLIES</h2>
            </div>
            <Link to="/shop" className="group flex items-center font-bold text-primary-500">
              View All <ArrowRight className="ml-2 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-24 relative overflow-hidden group">
        <div className="container mx-auto px-6">
          <div className="relative bg-black rounded-[3rem] overflow-hidden p-12 md:p-24 flex flex-col items-center text-center">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1958&auto=format&fit=crop" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                alt="Promo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tighter">
                PREMIUM BELGIAN <br /> CHOCOLATE OFFERS
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Discover the finest couverture for your patisserie. Limited time offers on bulk collections.
              </p>
              <Link 
                to="/shop?category=Premium Chocolate"
                className="inline-block px-12 py-5 bg-primary-600 text-white rounded-full font-black uppercase tracking-widest hover:bg-primary-700 transition-all shadow-2xl shadow-primary-500/20"
              >
                Indulge Now
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-24 bg-gray-50 dark:bg-white/[0.01]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <div className="glass p-12 md:p-20 rounded-[3rem] border border-gray-200 dark:border-white/5">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">The Baker's Journal</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-lg mx-auto">
              Subscribe for exclusive recipes, pro tips, and early access to artisanal releases.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-black uppercase tracking-widest hover:bg-primary-500 dark:hover:bg-primary-500 hover:text-white transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;