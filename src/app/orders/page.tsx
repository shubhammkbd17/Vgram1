'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { orderAPI } from '@/lib/api';
import { Order, OrderStatus } from '@/lib/types';
import { Loader2, Compass, ClipboardList, ShoppingBag, MapPin, Phone, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, loading } = useApp();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const fetchOrders = async () => {
    if (!user) return;
    setDbLoading(true);
    try {
      const data = await orderAPI.getOrders(user.id, user.role);
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { success } = await orderAPI.updateOrderStatus(orderId, newStatus);
      if (success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || (dbLoading && orders.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pb-20 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-green-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">My Orders</h1>
            <p className="text-sm text-stone-500">Track and manage orders placed or received on Vgram.</p>
          </div>
        </div>
        <button
          onClick={fetchOrders}
          className="bg-stone-100 hover:bg-stone-250 p-2.5 rounded-xl border border-stone-200 text-stone-600 self-end sm:self-center transition-all"
          title="Refresh orders list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center shadow-sm max-w-xl mx-auto">
          <p className="text-stone-400 text-sm font-semibold mb-4">You do not have any orders recorded.</p>
          <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-full inline-block shadow">
            Browse Products Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl mx-auto">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-100 rounded-3xl p-6 shadow-sm space-y-4">
              
              {/* Order Meta */}
              <div className="flex justify-between items-start flex-wrap gap-2 border-b border-stone-50 pb-3">
                <div>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Order Reference</span>
                  <p className="text-sm font-bold text-stone-850">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Order Date</span>
                  <p className="text-xs text-stone-500 font-semibold">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Stakeholders details */}
              <div className="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-150 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">Recipient Address</p>
                  <p className="flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{order.delivery_address}</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                    {user.role === 'producer' ? 'Customer Contact' : 'Farmer Contact'}
                  </p>
                  <p className="font-semibold text-stone-850">
                    {user.role === 'producer' ? order.consumer?.full_name : order.producer?.full_name || 'Collective Farmer'}
                  </p>
                  <p className="flex items-center gap-1 text-stone-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{user.role === 'producer' ? order.consumer?.phone : order.producer?.phone || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Order Items list */}
              <div className="space-y-2">
                <p className="font-bold text-stone-700 uppercase tracking-wider text-[10px] mb-2.5">Purchased Harvest Details</p>
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-stone-50 pb-2">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.product?.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                        alt={item.product?.title} 
                        className="w-10 h-10 rounded-lg object-cover bg-stone-50 border shrink-0"
                      />
                      <div>
                        <span className="font-bold text-stone-900 text-sm block">{item.product?.title || 'Organic Item'}</span>
                        <span className="text-[10px] text-stone-400">₹{item.price} / {item.product?.unit || 'unit'}</span>
                      </div>
                    </div>
                    <span className="font-semibold text-stone-700">x{item.quantity}</span>
                    <span className="font-bold text-stone-950">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center pt-2.5">
                <span className="text-stone-500 text-xs font-semibold">Grand Total:</span>
                <span className="text-xl font-extrabold text-stone-900">₹{order.total_amount}</span>
              </div>

              {/* Actions details depending on role */}
              {user.role === 'producer' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="pt-3 border-t border-stone-50 flex items-center justify-between gap-4">
                  <span className="text-xs text-stone-400 font-semibold">Update status order:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-stone-50 text-xs border border-stone-200 rounded-xl px-3 py-2 focus:outline-none text-stone-700"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="accepted">Accept Order</option>
                    <option value="shipping">Ship Out</option>
                    <option value="delivered">Mark Delivered</option>
                    <option value="cancelled">Cancel Order</option>
                  </select>
                </div>
              )}

              {user.role === 'consumer' && order.status === 'pending' && (
                <div className="pt-3 border-t border-stone-50 flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                    className="bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Cancel Placed Order
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
