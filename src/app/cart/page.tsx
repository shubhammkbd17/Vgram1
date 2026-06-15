'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { orderAPI } from '@/lib/api';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Loader2, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, cart, updateCartQuantity, removeFromCart, clearCart } = useApp();
  const router = useRouter();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setDeliveryAddress(user.address || '');
    }
  }, [user]);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingCharge = subtotal > 500 ? 0 : 50; // Free delivery above 500
  const total = subtotal + shippingCharge;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (cart.length === 0) return;

    if (!deliveryAddress.trim()) {
      setErrorMsg('Please enter a delivery address.');
      return;
    }

    setCheckingOut(true);
    setErrorMsg('');

    try {
      // Group items by producer
      const groupedByProducer: { [producerId: string]: typeof cart } = {};
      cart.forEach(item => {
        const prodId = item.product.producer_id;
        if (!groupedByProducer[prodId]) {
          groupedByProducer[prodId] = [];
        }
        groupedByProducer[prodId].push(item);
      });

      // Place separate orders for each producer
      for (const prodId of Object.keys(groupedByProducer)) {
        const items = groupedByProducer[prodId];
        const producerTotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

        const orderItemsPayload = items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        }));

        const { error } = await orderAPI.placeOrder(
          user.id,
          prodId,
          orderItemsPayload,
          producerTotal,
          deliveryAddress
        );

        if (error) throw error;
      }

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex justify-center">
          <span className="p-4 bg-green-50 rounded-full border border-green-200 text-green-700 animate-bounce">
            <CheckCircle2 className="w-16 h-16" />
          </span>
        </div>
        <h2 className="text-3xl font-extrabold text-stone-900">Order Placed Successfully!</h2>
        <p className="text-stone-500 text-sm leading-relaxed">
          Thank you for shopping directly from local producers! Your orders have been registered with the farmers. You can track status in your dashboard.
        </p>
        <div className="pt-4 flex flex-col gap-2.5">
          <Link href="/dashboard" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full inline-block shadow">
            Go to Dashboard
          </Link>
          <Link href="/products" className="text-green-750 hover:underline text-sm font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-green-100 pb-4">
        <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <ShoppingCart className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">My Cart</h1>
          <p className="text-sm text-stone-500">Review items and fill delivery details to complete checkout.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl p-4 font-semibold">
          {errorMsg}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center shadow-sm">
          <p className="text-stone-400 text-sm font-semibold mb-4">Your shopping cart is empty.</p>
          <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full inline-block shadow">
            Shop Harvests Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns: Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="bg-white border border-green-50/50 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
                
                {/* Image & Title */}
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                    alt={item.product.title} 
                    className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{item.product.title}</h4>
                    <p className="text-xs text-stone-500">
                      ₹{item.product.price} / {item.product.unit}
                    </p>
                  </div>
                </div>

                {/* Adjustments & Delete */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-stone-100 transition-colors text-stone-600 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 text-xs font-bold text-stone-850 select-none">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-stone-100 transition-colors text-stone-600 cursor-pointer"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-stone-900 text-sm w-16 text-right">
                    ₹{item.product.price * item.quantity}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 hover:bg-red-50 text-red-500 border border-transparent hover:border-red-100 rounded-lg cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
            
            <button
              onClick={clearCart}
              className="text-stone-400 hover:text-red-650 text-xs font-semibold"
            >
              Clear Entire Cart
            </button>
          </div>

          {/* Right Column: Checkout Form Summary */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-green-50 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-lg border-b border-stone-100 pb-2">Checkout Summary</h3>
              
              <div className="text-xs space-y-2 text-stone-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge.toFixed(2)}`}</span>
                </div>
                {shippingCharge > 0 && (
                  <p className="text-[10px] text-green-700 bg-green-50 p-2 rounded-lg leading-relaxed">
                    💡 Spend ₹{500 - subtotal} more for **FREE shipping**!
                  </p>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-sm border-t border-stone-100 pt-2">
                  <span>Total (INR)</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery address and Checkout actions */}
            <form onSubmit={handleCheckout} className="bg-white p-6 rounded-2xl border border-green-50 shadow-sm space-y-4">
              <h3 className="font-bold text-stone-800 text-base flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5 text-green-600" /> Delivery Address
              </h3>
              
              <div>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter complete address..."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-xs focus:outline-none focus:border-green-600 text-stone-800"
                />
              </div>

              {user ? (
                <button
                  type="submit"
                  disabled={checkingOut}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  {checkingOut ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Placing Order...
                    </>
                  ) : (
                    <>
                      Place Orders Now <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-center text-xs text-stone-400 font-semibold">Please log in to complete checkout.</p>
                  <Link 
                    href="/login" 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl block text-center shadow"
                  >
                    Log In to Checkout
                  </Link>
                </div>
              )}
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
