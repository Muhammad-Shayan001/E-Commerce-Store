
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black tracking-tighter text-primary-600">
              LUXE<span className="text-gray-900 dark:text-white">COMMERCE</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Experience technology at its finest. We curate the world's most premium gadgets for the modern explorer.
            </p>
            <div className="flex items-center space-x-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Quick Links</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li><Link to="/shop" className="hover:text-primary-500 transition-colors">All Products</Link></li>
              <li><Link to="/shop?featured=true" className="hover:text-primary-500 transition-colors">Featured</Link></li>
              <li><Link to="/profile" className="hover:text-primary-500 transition-colors">My Account</Link></li>
              <li><Link to="/checkout" className="hover:text-primary-500 transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Support</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-500 transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-8">Contact Us</h4>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-primary-500 shrink-0" />
                <span>123 Tech Avenue, Silicon Valley, CA 94043</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-primary-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-primary-500 shrink-0" />
                <span>hello@luxecommerce.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-500">
          <p>© 2024 LuxeCommerce. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Paypal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" alt="Mastercard" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
