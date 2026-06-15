'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1: Brand */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
            <Compass className="w-8 h-8 text-green-500" />
            <span>Vgram</span>
          </Link>
          <p className="text-sm text-stone-400">
            Bridging the gap between rural producers and urban consumers. We enable fair trade, transparency, and fresh organic products directly to your doorstep.
          </p>
          <div className="flex gap-4 pt-2">
            {/* Social Icons */}
            <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-green-600 flex items-center justify-center text-white transition-colors">
              <span className="font-bold text-xs">FB</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-green-600 flex items-center justify-center text-white transition-colors">
              <span className="font-bold text-xs">TW</span>
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-stone-800 hover:bg-green-600 flex items-center justify-center text-white transition-colors">
              <span className="font-bold text-xs">IG</span>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg border-b border-stone-800 pb-2">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="hover:text-green-400 transition-colors">Browse Products</Link>
            </li>
            <li>
              <Link href="/producers" className="hover:text-green-400 transition-colors">Meet Producers</Link>
            </li>
            <li>
              <Link href="/map" className="hover:text-green-400 transition-colors font-medium text-green-500">Map View (Nearby)</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg border-b border-stone-800 pb-2">Contact Info</h4>
          <ul className="space-y-3 text-sm text-stone-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-5 h-5 text-green-500 shrink-0" />
              <span>102, Green Valley Estate, Anand, Gujarat, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-500 shrink-0" />
              <span>support@vgram.org</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-lg border-b border-stone-800 pb-2">Newsletter</h4>
          <p className="text-sm text-stone-400">
            Subscribe to our newsletter for weekly fresh arrivals, farmer stories, and special discount offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-800 text-stone-100 placeholder-stone-500 px-3 py-2 text-sm rounded-lg border border-stone-700 focus:outline-none focus:border-green-500 w-full"
              required
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-green-400 mt-1 animate-pulse">Thank you for subscribing!</p>
          )}
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
        <p>&copy; {new Date().getFullYear()} Vgram Direct Marketplace. All Rights Reserved. Made with 🌱 for Rural Communities.</p>
      </div>
    </footer>
  );
}
