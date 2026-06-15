'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { productAPI } from '@/lib/api';
import { Product } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';
import { Search, Loader2, Compass, Filter, MapPin, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const { user, addToCart } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxDistance, setMaxDistance] = useState('Any'); // '50', '150', '500', 'Any'

  // Notification state
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic Goods', 'Handicrafts'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, query, category, maxPrice, maxDistance, user]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    // Search query
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Max Price
    result = result.filter(p => p.price <= maxPrice);

    // Distance Filter (Requires buyer location and seller location)
    if (maxDistance !== 'Any' && user && user.location_lat && user.location_lng) {
      const limit = parseFloat(maxDistance);
      result = result.filter(p => {
        if (p.producer && p.producer.location_lat && p.producer.location_lng) {
          const dist = haversineDistance(
            user.location_lat,
            user.location_lng,
            p.producer.location_lat,
            p.producer.location_lng
          );
          return dist !== null && dist <= limit;
        }
        return false;
      });
    }

    setFilteredProducts(result);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setAddedItemName(product.title);
    setTimeout(() => setAddedItemName(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-green-100 pb-4">
        <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">Fresh Marketplace</h1>
          <p className="text-sm text-stone-500">Search and filter direct organic harvests and handmade products from nearby producers.</p>
        </div>
      </div>

      {addedItemName && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900/95 backdrop-blur text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-stone-850 animate-in slide-in-from-bottom-4 duration-300">
          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
          <p className="text-xs font-semibold">Added **{addedItemName}** to Cart!</p>
        </div>
      )}

      {/* Main Grid: Filters Left, Listings Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="bg-white p-6 rounded-2xl border border-green-50 shadow-sm space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
              <Filter className="w-4.5 h-4.5 text-green-600" /> Filters
            </h3>
            <button
              onClick={() => {
                setQuery('');
                setCategory('All');
                setMaxPrice(1000);
                setMaxDistance('Any');
              }}
              className="text-xs text-stone-400 hover:text-green-700 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">Search</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Search crop, craft..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-9 border border-stone-200 rounded-xl bg-stone-50 text-xs focus:outline-none focus:border-green-600 text-stone-800"
              />
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">Category</label>
            <div className="flex flex-col gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    category === cat
                      ? 'bg-green-50 border-l-2 border-green-700 text-green-800'
                      : 'hover:bg-stone-50 text-stone-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-stone-700 uppercase tracking-wide">Max Price</label>
              <span className="font-semibold text-green-800">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-green-600 cursor-pointer"
            />
          </div>

          {/* Distance Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide">Max Distance</label>
            {user && user.location_lat ? (
              <select
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-green-600 bg-stone-50 text-stone-850 cursor-pointer"
              >
                <option value="Any">Any Distance</option>
                <option value="50">Within 50 km</option>
                <option value="150">Within 150 km</option>
                <option value="500">Within 500 km</option>
              </select>
            ) : (
              <div className="bg-stone-50 border border-amber-100 p-3 rounded-xl">
                <p className="text-[10px] text-stone-400 font-medium leading-relaxed">
                  Log in and configure location in your profile to enable distance filters.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Listings Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="min-h-[40vh] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center shadow-sm">
              <p className="text-stone-400 text-sm font-semibold mb-2">No matching products found.</p>
              <p className="text-xs text-stone-400">Try relaxing your search terms or expanding your filter settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(prod => {
                // Compute distance if possible
                let distanceText = '';
                if (user && user.location_lat && prod.producer && prod.producer.location_lat) {
                  const dist = haversineDistance(
                    user.location_lat,
                    user.location_lng,
                    prod.producer.location_lat,
                    prod.producer.location_lng
                  );
                  distanceText = dist !== null ? `${dist.toFixed(1)} km away` : '';
                }

                return (
                  <div key={prod.id} className="bg-white border border-green-50/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <Link href={`/products/${prod.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={prod.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                        alt={prod.title} 
                        className="w-full h-44 object-cover bg-stone-100"
                      />
                    </Link>
                    
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="bg-green-50 border border-green-200 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {prod.category}
                          </span>
                          {distanceText && (
                            <span className="text-[10px] text-stone-400 font-semibold flex items-center gap-0.5">
                              <MapPin className="w-3 h-3 text-red-500" /> {distanceText}
                            </span>
                          )}
                        </div>
                        <Link href={`/products/${prod.id}`}>
                          <h4 className="font-bold text-stone-900 text-base line-clamp-1 hover:text-green-700 transition-colors">{prod.title}</h4>
                        </Link>
                        <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                      </div>

                      <div className="pt-3 border-t border-stone-50 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wide">Direct Rate</span>
                          <span className="text-base font-bold text-stone-850">
                            ₹{prod.price} <span className="text-xs text-stone-400 font-normal">/ {prod.unit}</span>
                          </span>
                        </div>

                        {prod.stock > 0 ? (
                          <button
                            onClick={() => handleAddToCart(prod)}
                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition-all flex items-center justify-center shadow-sm cursor-pointer"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-4.5 h-4.5" />
                          </button>
                        ) : (
                          <span className="text-red-500 font-bold text-xs">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
