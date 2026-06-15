'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { productAPI, reviewAPI } from '@/lib/api';
import { Product, Review } from '@/lib/types';
import { haversineDistance } from '@/lib/utils';
import { Loader2, ArrowLeft, Star, ShoppingCart, Plus, Minus, MapPin, MessageSquare, Compass, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { user, addToCart } = useApp();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart quantity state
  const [quantity, setQuantity] = useState(1);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    fetchProductDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const prod = await productAPI.getProduct(params.id);
      if (prod) {
        setProduct(prod);
        const revs = await reviewAPI.getReviews(params.id);
        setReviews(revs);
      } else {
        router.push('/products');
      }
    } catch (e) {
      console.error(e);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setNotification(`Added ${quantity} ${product.unit}(s) of ${product.title} to Cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    setReviewSubmitting(true);
    try {
      const { review, error } = await reviewAPI.addReview(product.id, user.id, rating, comment);
      if (review) {
        // Refresh reviews list
        const revs = await reviewAPI.getReviews(product.id);
        setReviews(revs);
        setComment('');
      } else {
        alert(error?.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  // Calculate Distance
  let distanceText = '';
  if (user && user.location_lat && product.producer && product.producer.location_lat) {
    const dist = haversineDistance(
      user.location_lat,
      user.location_lng,
      product.producer.location_lat,
      product.producer.location_lng
    );
    distanceText = dist !== null ? `${dist.toFixed(1)} km away` : '';
  }

  // Calculate average rating
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* Back button */}
      <Link href="/products" className="inline-flex items-center gap-1.5 text-stone-500 hover:text-green-700 font-semibold text-sm mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      {notification && (
        <div className="mb-6 bg-green-50 text-green-700 border border-green-200 text-sm rounded-xl p-4 font-semibold">
          {notification}
        </div>
      )}

      {/* Product Display Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Side: Product Image */}
        <div className="rounded-3xl overflow-hidden shadow bg-white border border-stone-100 flex items-center justify-center h-[350px] sm:h-[450px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Product Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-stone-400 text-xs font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {avgRating} ({reviews.length} reviews)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">{product.title}</h1>
            
            {distanceText && (
              <p className="text-xs text-stone-400 font-semibold flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-500" /> Harvested {distanceText} from your coordinates.
              </p>
            )}
          </div>

          <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex items-baseline gap-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Direct Price:</span>
            <span className="text-3xl font-extrabold text-stone-900">₹{product.price}</span>
            <span className="text-stone-500 font-medium text-sm">/ {product.unit}</span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 text-sm">Product Description</h4>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">{product.description || 'No description provided.'}</p>
          </div>

          {/* Add to Cart Actions */}
          <div className="pt-4 border-t border-stone-100 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-stone-100 transition-colors text-stone-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-stone-850 text-sm select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-stone-100 transition-colors text-stone-600"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-stone-400 font-semibold">{product.stock} {product.unit}(s) available</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:bg-stone-300 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Shopping Cart
            </button>
          </div>

          {/* Producer info details */}
          {product.producer && (
            <div className="mt-8 border-t border-stone-100 pt-6">
              <h4 className="font-bold text-stone-800 text-sm mb-3.5 flex items-center gap-1">
                <Compass className="w-4 h-4 text-green-600" /> Met the Producer
              </h4>
              <div className="flex items-start gap-3 bg-stone-50 border border-stone-100 p-4 rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.producer.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${product.producer.full_name}`} 
                  alt={product.producer.full_name || 'Farmer'} 
                  className="w-12 h-12 rounded-full border border-green-200 bg-white"
                />
                <div className="space-y-1">
                  <h5 className="font-bold text-stone-900 text-sm">{product.producer.full_name}</h5>
                  <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">{product.producer.role} member</p>
                  <p className="text-xs text-stone-500 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span>{product.producer.address || 'Location coordinates registered.'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Reviews Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-10 border-t border-stone-100 pt-10">
        
        {/* Left Column: Review Form */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-stone-900 flex items-center gap-1.5">
            <MessageSquare className="w-5.5 h-5.5 text-green-600" /> Share Your Review
          </h3>

          {user ? (
            <form onSubmit={handleSubmitReview} className="bg-white border border-green-50 p-5 rounded-2xl shadow-sm space-y-4">
              {/* Rating stars picker */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">My Rating</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          star <= rating 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-stone-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text area */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">Review Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your quality experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl bg-stone-50 text-stone-800 text-sm focus:outline-none focus:border-green-600"
                />
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-1 shadow-sm transition-all disabled:bg-stone-300"
              >
                {reviewSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Submit Review <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-stone-50 border border-stone-100 p-5 rounded-2xl text-center">
              <p className="text-xs text-stone-500 font-medium mb-3.5">Log in to post ratings and reviews on this producer&apos;s product.</p>
              <Link href="/login" className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 px-4 rounded-xl inline-block shadow">
                Log In Now
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-2xl font-bold text-stone-900">Consumer Reviews ({reviews.length})</h3>

          {reviews.length === 0 ? (
            <div className="bg-white border border-stone-100 p-8 text-center rounded-2xl shadow-sm">
              <p className="text-stone-400 text-xs font-medium">No reviews written yet. Be the first to purchase and rate this harvest!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-stone-50 p-5 rounded-2xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={rev.user?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${rev.user?.full_name}`} 
                        alt={rev.user?.full_name || 'Buyer'} 
                        className="w-7 h-7 rounded-full border bg-stone-50 border-stone-200"
                      />
                      <span className="font-bold text-stone-900 text-sm">{rev.user?.full_name || 'Verified Buyer'}</span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-stone-200'
                          }`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-500">{new Date(rev.created_at).toLocaleDateString()}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
