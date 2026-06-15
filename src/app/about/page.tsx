'use client';

import React from 'react';
import { Compass, Leaf, ArrowRight, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    {
      icon: HeartHandshake,
      title: 'Farmer First',
      description: 'Farmers and artisans receive 100% of their listed price. Zero commission loops.'
    },
    {
      icon: ShieldCheck,
      title: 'Certified Organic',
      description: 'We encourage pesticide-free crop harvesting and natural handmade crafting processes.'
    },
    {
      icon: Leaf,
      title: 'Earthy & Fresh',
      description: 'Harvested on order. Shipped immediately to keep nutrition, freshness, and quality intact.'
    }
  ];

  return (
    <div className="space-y-16 py-12 pb-20 max-w-6xl mx-auto px-4">
      
      {/* 1. Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" /> Our Heritage
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 leading-tight">About Vgram</h1>
        <p className="text-sm sm:text-base text-stone-500 leading-relaxed">
          We are dedicated to building a fair, transparent, and direct bridge between hard-working rural producers and conscious urban buyers.
        </p>
      </div>

      {/* 2. Visual Split Story */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-lg h-[350px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Organic farming green fields"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">Our Mission & Purpose</h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            For generations, rural producers have struggled to fetch fair prices for their harvests due to a convoluted chain of middlemen. Consumers in cities, on the other hand, pay premium prices for cold-stored food of uncertain origin.
          </p>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            Vgram replaces this broken model with an open, direct digital marketplace. By utilizing Google Maps coordination, we calculate exact distances so consumers can support nearest farm collectives. That shortens supply lines, reduces food miles, and ensures the freshest items land on your table.
          </p>
        </div>
      </div>

      {/* 3. Core Values Grid */}
      <div className="bg-stone-100/60 p-10 rounded-3xl border border-stone-200/50 space-y-12">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 text-center">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 text-center space-y-4">
                <span className="w-10 h-10 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="w-5.5 h-5.5" />
                </span>
                <h4 className="font-bold text-stone-900 text-base">{v.title}</h4>
                <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{v.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Co-op support call to action */}
      <div className="text-center space-y-4 bg-gradient-to-r from-green-800 to-green-700 text-white p-10 rounded-3xl shadow-md">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Join the Vgram Collective</h2>
        <p className="text-xs sm:text-sm text-green-100 max-w-xl mx-auto leading-relaxed">
          Whether you are a consumer trying to eat healthier or a farmer looking to establish fair pricing for your crops, Vgram is here to empower you.
        </p>
        <div className="pt-2">
          <Link href="/signup" className="bg-white text-green-800 hover:bg-green-50 font-bold px-6 py-3 rounded-full inline-flex items-center gap-1.5 transition-all text-sm shadow">
            Register for Free Account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
}
