'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { productAPI, orderAPI } from '@/lib/api';
import { Product, Order, UserRole, OrderStatus } from '@/lib/types';
import { Loader2, Plus, Edit2, Trash2, Eye, ClipboardList, CheckCircle2, XCircle, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useApp();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  // CRUD state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState('Vegetables');
  const [stock, setStock] = useState('100');
  const [imageUrl, setImageUrl] = useState('');
  
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setDbLoading(true);
    try {
      if (user.role === 'producer') {
        const prods = await productAPI.getProducts({ producerId: user.id });
        setProducts(prods);
        const ords = await orderAPI.getOrders(user.id, 'producer');
        setOrders(ords);
      } else {
        const ords = await orderAPI.getOrders(user.id, 'consumer');
        setOrders(ords);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setDbLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setUnit('kg');
    setCategory('Vegetables');
    setStock('100');
    setImageUrl('');
    setFormError('');
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setTitle(prod.title);
    setDescription(prod.description || '');
    setPrice(prod.price.toString());
    setUnit(prod.unit);
    setCategory(prod.category);
    setStock(prod.stock.toString());
    setImageUrl(prod.image_url || '');
    setFormError('');
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const { success } = await productAPI.deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setFormError('');
    setFormSubmitting(true);

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock);

    if (isNaN(numericPrice) || numericPrice < 0) {
      setFormError('Please enter a valid price.');
      setFormSubmitting(false);
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      setFormError('Please enter a valid stock level.');
      setFormSubmitting(false);
      return;
    }

    // Default image if empty
    const img = imageUrl.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';

    const productPayload = {
      producer_id: user.id,
      title,
      description,
      price: numericPrice,
      unit,
      category,
      stock: numericStock,
      image_url: img,
    };

    try {
      if (editingProduct) {
        const { product, error } = await productAPI.updateProduct(editingProduct.id, productPayload);
        if (error) throw error;
        if (product) {
          setProducts(products.map(p => p.id === editingProduct.id ? product : p));
        }
      } else {
        const { product, error } = await productAPI.createProduct(productPayload);
        if (error) throw error;
        if (product) {
          setProducts([product, ...products]);
        }
      }
      setShowProductModal(false);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setFormSubmitting(false);
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

  if (loading || (dbLoading && orders.length === 0 && products.length === 0)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const producerEarnings = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dashboard Top Intro */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-green-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">Dashboard</h1>
          <p className="text-sm text-stone-500 capitalize">Logged in as {user.role} | Welcome back, {user.full_name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="px-4 py-2 border border-green-200 text-green-700 bg-white hover:bg-green-50 rounded-xl text-sm font-semibold transition-all">
            Edit Profile Map
          </Link>
          {user.role === 'producer' && (
            <button
              onClick={handleOpenAddModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4.5 h-4.5" /> Add Product
            </button>
          )}
        </div>
      </div>

      {user.role === 'producer' ? (
        /* PRODUCER DASHBOARD */
        <div className="space-y-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-green-50 shadow-sm flex items-center gap-4">
              <span className="p-3 bg-green-50 rounded-xl text-green-700"><TrendingUp className="w-6 h-6" /></span>
              <div>
                <p className="text-xs font-semibold text-stone-400">Total Earnings</p>
                <h3 className="text-2xl font-bold text-stone-900">₹{producerEarnings.toFixed(2)}</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-50 shadow-sm flex items-center gap-4">
              <span className="p-3 bg-amber-50 rounded-xl text-amber-700"><Package className="w-6 h-6" /></span>
              <div>
                <p className="text-xs font-semibold text-stone-400">Products Listed</p>
                <h3 className="text-2xl font-bold text-stone-900">{products.length} Items</h3>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-green-50 shadow-sm flex items-center gap-4">
              <span className="p-3 bg-blue-50 rounded-xl text-blue-700"><ClipboardList className="w-6 h-6" /></span>
              <div>
                <p className="text-xs font-semibold text-stone-400">Orders Received</p>
                <h3 className="text-2xl font-bold text-stone-900">{orders.length} Placed</h3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Products CRUD List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-stone-800 flex items-center gap-1.5">
                <Package className="w-5 h-5 text-green-600" /> My Listed Products
              </h3>

              {products.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-stone-200">
                  <p className="text-stone-400 mb-4 text-sm font-medium">You haven&apos;t listed any harvests/goods yet.</p>
                  <button onClick={handleOpenAddModal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Product Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(prod => (
                    <div key={prod.id} className="bg-white border border-green-50 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={prod.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                        alt={prod.title} 
                        className="w-full h-36 object-cover bg-stone-100"
                      />
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="bg-green-50 border border-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {prod.category}
                          </span>
                          <h4 className="font-bold text-stone-900 text-sm mt-1.5 line-clamp-1">{prod.title}</h4>
                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-stone-50 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-stone-400">Price / Stock</span>
                            <p className="text-sm font-bold text-stone-800">
                              ₹{prod.price} <span className="text-[10px] text-stone-500 font-normal">/ {prod.unit}</span>
                              <span className="ml-2 bg-stone-100 px-1.5 py-0.5 rounded text-[10px] text-stone-600 font-semibold">{prod.stock} left</span>
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleOpenEditModal(prod)}
                              className="p-1.5 hover:bg-green-50 border border-green-100 text-green-700 rounded-lg transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 hover:bg-red-50 border border-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Received Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-stone-800 flex items-center gap-1.5">
                <ClipboardList className="w-5 h-5 text-green-600" /> Orders Received
              </h3>

              {orders.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-2xl border border-stone-100">
                  <p className="text-xs text-stone-400 font-medium">No orders received yet. They will appear here when buyers purchase your listings.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-stone-400 font-semibold">Order ID: #{order.id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100 space-y-1">
                        <p><strong>Customer:</strong> {order.consumer?.full_name || 'Anonymous'}</p>
                        <p><strong>Phone:</strong> {order.consumer?.phone || 'N/A'}</p>
                        <p className="line-clamp-1"><strong>Deliver to:</strong> {order.delivery_address}</p>
                      </div>

                      {/* Items */}
                      <div className="border-t border-stone-50 pt-2 text-xs space-y-1 text-stone-500">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>{item.product?.title || 'Unknown Item'} x{item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold text-stone-800 border-t border-stone-50 pt-1.5 text-sm">
                          <span>Total Amount</span>
                          <span>₹{order.total_amount}</span>
                        </div>
                      </div>

                      {/* Update status action */}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="pt-2 flex gap-1.5">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                            className="bg-stone-50 text-xs border border-stone-200 rounded-lg p-1.5 focus:outline-none flex-1 text-stone-700"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="accepted">Accept Order</option>
                            <option value="shipping">Ship Out</option>
                            <option value="delivered">Mark Delivered</option>
                            <option value="cancelled">Cancel Order</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* CONSUMER DASHBOARD */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order history */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-1.5">
              <ShoppingBag className="w-5 h-5 text-green-600" /> My Purchases / Order History
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-stone-100">
                <p className="text-stone-400 mb-4 text-sm font-medium">You haven&apos;t placed any orders yet. Fresh organic foods are waiting for you!</p>
                <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all inline-block shadow">
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-stone-400 font-semibold">Order ID: #{order.id.slice(-6).toUpperCase()}</p>
                        <p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <p><strong>Seller:</strong> {order.producer?.full_name || 'Co-op Farmer'}</p>
                      <p><strong>Deliver to:</strong> {order.delivery_address}</p>
                    </div>

                    {/* Items */}
                    <div className="border-t border-stone-100 pt-3 space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-stone-700">{item.product?.title || 'Harvest Goods'} x{item.quantity}</span>
                          <span className="font-semibold text-stone-800">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-stone-900 border-t border-stone-100 pt-2 text-base">
                        <span>Total Paid</span>
                        <span>₹{order.total_amount}</span>
                      </div>
                    </div>

                    {order.status === 'pending' && (
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                          className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Recommendations widget */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-800 to-green-700 text-white p-6 rounded-2xl shadow-md space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-1.5"><Eye className="w-5 h-5 text-green-200" /> Vgram Direct</h3>
              <p className="text-xs text-green-100">Get fresh wheat, Shimla apples, cotton, and organic turmeric straight from the farmers with distance calculation.</p>
              <Link href="/products" className="bg-white text-green-800 hover:bg-green-50 font-bold text-xs py-2.5 px-4 rounded-xl block text-center shadow transition-all">
                Browse Fresh Products
              </Link>
            </div>
            
            <div className="bg-stone-100 p-5 rounded-2xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-800 text-sm">Helpful Tip</h4>
              <p className="text-xs text-stone-500 leading-relaxed">Ensure you have updated your delivery coordinates in the **My Profile** settings page, so farmers can calculate nearby deliveries accurately!</p>
            </div>
          </div>

        </div>
      )}

      {/* CRUD Add/Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-green-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-green-700 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingProduct ? 'Edit Product Info' : 'List New Product'}</h3>
              <button 
                onClick={() => setShowProductModal(false)}
                className="text-green-100 hover:text-white transition-colors text-2xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="p-5 space-y-4">
              {formError && (
                <div className="bg-red-50 text-red-700 text-xs border border-red-200 p-3 rounded-xl font-medium">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Red Apples"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                <textarea
                  placeholder="Tell buyers about how this was grown or made..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Price (₹ INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 150"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Selling Unit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kg, piece, dozen, 500g"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800 cursor-pointer"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Organic Goods">Organic Goods</option>
                    <option value="Handicrafts">Handicrafts</option>
                  </select>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Initial Stock Level</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-green-600 bg-stone-50 text-stone-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 text-sm font-semibold rounded-xl hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white px-5 py-2 text-sm font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : editingProduct ? 'Update Listing' : 'Publish Listing'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
