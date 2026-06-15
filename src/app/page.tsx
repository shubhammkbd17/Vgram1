'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Leaf, ArrowRight, ShieldCheck, HeartHandshake, Sprout, Globe } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Globe,
      title: 'Direct Connection',
      description: 'Eliminate middleman margins. Urban consumers buy fresh crops directly from local farms.'
    },
    {
      icon: ShieldCheck,
      title: 'Complete Transparency',
      description: 'Know exactly where your food comes from with map tracking and verified producer profiles.'
    },
    {
      icon: HeartHandshake,
      title: 'Fair Pricing',
      description: 'Direct transaction means better earnings for rural farmers and affordable fresh produce for families.'
    },
    {
      icon: Sprout,
      title: 'Sustainability',
      description: 'Promote eco-friendly farming practices and reduce overall supply chain carbon footprint.'
    }
  ];

  const topProducers = [
    {
      name: 'Rajesh Kumar',
      location: 'Ludhiana, Punjab',
      specialty: 'Organic Wheat & Greens',
      image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Sunita Devi',
      location: 'Shimla, Himachal Pradesh',
      specialty: 'Royal Delicious Apples',
      image: 'https://images.unsplash.com/photo-1595246140625-573b715e11d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Amit Patel',
      location: 'Anand, Gujarat',
      specialty: 'Organic Spices & Clay Pots',
      image: 'https://images.unsplash.com/photo-1544252636-f0466c4c5b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Lakshmi Rao',
      location: 'Chikmagalur, Karnataka',
      specialty: 'Aromatic Arabica Coffee',
      image: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        {/* Background Graphic */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 select-none pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6 text-white select-none">
          <span className="inline-flex items-center gap-1.5 bg-green-900/60 border border-green-700/50 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5" /> 100% Direct Marketplace
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight select-none">
            Bridging the Gap Between <br />
            <span className="text-green-400">Farms & Cities</span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed select-none">
            A revolutionary platform connecting rural farmers, dairies, and artisans directly with urban consumers for fair trade, freshness, and community growth.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/products" className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-green-950/30 transition-all select-none">
              Explore Products <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/signup" className="border border-stone-500 hover:border-white text-stone-200 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all select-none">
              Join as a Producer
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Why Choose Vgram?</h2>
          <p className="text-stone-500 max-w-xl mx-auto text-sm sm:text-base">We are redefining the agricultural and handmade goods supply chain using maps and transparency.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div key={i} className="bg-white border border-green-50/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group hover:-translate-y-1 duration-300">
                <span className="w-12 h-12 bg-green-50 text-green-700 rounded-full flex items-center justify-center mb-5 border border-green-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="font-bold text-stone-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Meet Our Top Producers */}
      <section className="bg-stone-100/60 py-20 border-y border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">Meet Our Top Producers</h2>
            <p className="text-stone-500 max-w-xl mx-auto text-sm sm:text-base">Support these local farmers and artisans whose produce is shipped directly to urban areas.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topProducers.map((prod, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-all">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={prod.image} alt={prod.name} className="w-full h-48 object-cover bg-stone-100" />
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-stone-900 text-lg">{prod.name}</h4>
                  <p className="text-stone-400 text-xs flex items-center gap-1 font-medium">
                    <Compass className="w-3.5 h-3.5 text-green-600" /> {prod.location}
                  </p>
                  <span className="inline-block bg-green-50 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {prod.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/producers" className="text-green-700 hover:text-green-800 font-bold text-sm inline-flex items-center gap-1 hover:underline">
              View All Registered Producers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Split Promotion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-tight">Empowering Rural Producers</h2>
          <p className="text-stone-500 leading-relaxed text-sm sm:text-base">
            Vgram gives power back to the hands that feed us. We provide rural farmers, dairy owners, and creative artisans the digital tools they need to list products, define fair rates, set physical farm map coordinates, and receive urban order requests without paying heavy commissions to middlemen.
          </p>
          <ul className="space-y-3.5 text-stone-700 text-sm sm:text-base">
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center"><Leaf className="w-3.5 h-3.5" /></span>
              <span>Easy online product listing and stock control</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center"><Leaf className="w-3.5 h-3.5" /></span>
              <span>Direct access to buyers with built-in distance filters</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center"><Leaf className="w-3.5 h-3.5" /></span>
              <span>Guaranteed fair trade and transparent communication</span>
            </li>
          </ul>
          <div className="pt-2">
            <Link href="/signup" className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-full inline-block shadow-md">
              Register as Farmer / Producer
            </Link>
          </div>
        </div>
        <div className="rounded-3xl overflow-hidden shadow-xl aspect-video lg:aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1595246140625-573b715e11d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Rural Producer Sunita"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

    </div>
  );
}
