'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { profileAPI } from '@/lib/api';
import { Profile } from '@/lib/types';
import { Loader2, Compass, MapPin, Phone, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

export default function ProducersPage() {
  const { user } = useApp();
  const [producers, setProducers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducers();
  }, []);

  const fetchProducers = async () => {
    setLoading(true);
    try {
      const data = await profileAPI.getProducers();
      setProducers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pb-20">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-green-100 pb-4">
        <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 leading-tight">Registered Producers</h1>
          <p className="text-sm text-stone-500">Meet our network of local farmers, artisans, and dairy owners supplying fresh goods directly.</p>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : producers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-16 text-center shadow-sm">
          <p className="text-stone-400 text-sm font-semibold mb-2">No registered producers found.</p>
          <p className="text-xs text-stone-400">Producers will appear here as soon as they sign up.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers.map((producer) => (
            <div key={producer.id} className="bg-white border border-green-50/50 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              
              {/* Profile head */}
              <div className="flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={producer.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${producer.full_name}`} 
                  alt={producer.full_name || 'Farmer'} 
                  className="w-16 h-16 rounded-full border border-green-200 bg-green-50 shadow-inner shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-lg line-clamp-1">{producer.full_name}</h3>
                  <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {producer.role}
                  </span>
                </div>
              </div>

              {/* Details info */}
              <div className="text-xs text-stone-500 space-y-2 border-t border-stone-50 pt-4">
                <p className="flex items-start gap-1.5 leading-relaxed">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{producer.address || 'Address coordinates pinned.'}</span>
                </p>
                {user && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{producer.phone || 'N/A'}</span>
                  </p>
                )}
              </div>

              {/* Action details */}
              <div className="pt-2">
                <Link
                  href={`/products?producerId=${producer.id}`}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  View Farmer&apos;s Catalog <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
