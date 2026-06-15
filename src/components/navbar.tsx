'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingCart, User, LogOut, Menu, X, MapPin, Compass } from 'lucide-react';

export default function Navbar() {
  const { user, cart, logoutUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700 tracking-tight">
          <Compass className="w-8 h-8 text-green-600 animate-pulse" />
          <span>Vgram</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/products" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Products</Link>
          <Link href="/producers" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Producers</Link>
          <Link href="/map" className="text-gray-600 hover:text-green-700 font-medium transition-colors flex items-center gap-1">
            <MapPin className="w-4 h-4" /> Map View
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-green-700 font-medium transition-colors">About</Link>
          <Link href="/contact" className="text-gray-600 hover:text-green-700 font-medium transition-colors">Contact</Link>
        </div>

        {/* Action Buttons / Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-700 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full border border-green-200 text-green-800 font-medium transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.full_name}`} 
                  alt={user.full_name || 'Profile'} 
                  className="w-7 h-7 rounded-full bg-green-200 border border-green-300"
                />
                <span className="max-w-[100px] truncate">{user.full_name}</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-green-100 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{user.full_name}</p>
                  </div>
                  <Link 
                    href="/dashboard" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link 
                    href="/orders" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-colors"
                  >
                    My Orders
                  </Link>
                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                  >
                    <div className="flex items-center gap-1.5">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 text-green-700 hover:text-green-800 font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu & Cart */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className="relative p-2 text-gray-600 hover:text-green-700 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMobileMenu} className="p-2 text-gray-600 hover:text-green-700">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Links Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-green-50 bg-white/98 px-4 py-4 space-y-3 shadow-inner">
          <Link 
            href="/products" 
            onClick={toggleMobileMenu}
            className="block py-2 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50"
          >
            Products
          </Link>
          <Link 
            href="/producers" 
            onClick={toggleMobileMenu}
            className="block py-2 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50"
          >
            Producers
          </Link>
          <Link 
            href="/map" 
            onClick={toggleMobileMenu}
            className="block py-2 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50 flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" /> Map View
          </Link>
          <Link 
            href="/about" 
            onClick={toggleMobileMenu}
            className="block py-2 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50"
          >
            About
          </Link>
          <Link 
            href="/contact" 
            onClick={toggleMobileMenu}
            className="block py-2 text-gray-700 hover:text-green-700 font-medium border-b border-gray-50"
          >
            Contact
          </Link>

          {user ? (
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 px-2 py-1 mb-2 bg-green-50 rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.full_name}`} 
                  alt={user.full_name || 'Profile'} 
                  className="w-8 h-8 rounded-full border border-green-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{user.full_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
              </div>
              <Link 
                href="/dashboard" 
                onClick={toggleMobileMenu}
                className="block py-2 px-2 text-gray-600 hover:bg-green-50 rounded"
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                onClick={toggleMobileMenu}
                className="block py-2 px-2 text-gray-600 hover:bg-green-50 rounded"
              >
                My Profile
              </Link>
              <Link 
                href="/orders" 
                onClick={toggleMobileMenu}
                className="block py-2 px-2 text-gray-600 hover:bg-green-50 rounded"
              >
                My Orders
              </Link>
              <button 
                onClick={() => {
                  toggleMobileMenu();
                  logoutUser();
                }}
                className="w-full text-left block py-2 px-2 text-red-600 hover:bg-red-50 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-2">
              <Link 
                href="/login" 
                onClick={toggleMobileMenu}
                className="text-center py-2 text-green-700 font-medium border border-green-600 rounded-full"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                onClick={toggleMobileMenu}
                className="text-center py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
