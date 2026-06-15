'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, initMockDb } from '@/lib/api';
import { Profile, CartItem, Product } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AppContextProps {
  user: Profile | null;
  loading: boolean;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  loginUser: (phone: string) => Promise<{ success: boolean; error: any }>;
  verifyOtp: (phone: string, otp: string, role?: 'producer' | 'consumer', name?: string) => Promise<{ user: Profile | null; error: any }>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  // Load user and cart from local storage / API on mount
  useEffect(() => {
    initMockDb();
    
    const initializeAuth = async () => {
      try {
        const currentUser = await authAPI.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Load cart
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('vgram_cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart');
        }
      }
    }

    // Listen to mock auth changes in other tabs/handlers
    const handleAuthChange = async () => {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    };
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  // Sync cart to localstorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('vgram_cart', JSON.stringify(newCart));
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    const newCart = [...cart];
    
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }
    saveCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const loginUser = async (phone: string) => {
    return await authAPI.signIn(phone);
  };

  const verifyOtp = async (phone: string, otp: string, role?: 'producer' | 'consumer', name?: string) => {
    const result = await authAPI.verifyOTP(phone, otp, role, name);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const logoutUser = async () => {
    await authAPI.signOut();
    setUser(null);
    clearCart();
    router.push('/');
  };

  const refreshUser = async () => {
    const currentUser = await authAPI.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        loginUser,
        verifyOtp,
        logoutUser,
        refreshUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
