'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Compass, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSuccess(false), 4000);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pb-20 space-y-16">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" /> Support Center
        </span>
        <h1 className="text-4xl font-extrabold text-stone-900 leading-tight">Get in Touch</h1>
        <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
          Have questions about the Vgram platform? Reach out to our customer support or developer co-op today.
        </p>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 border border-green-200 text-sm rounded-xl p-4 font-semibold flex items-center gap-2 max-w-xl mx-auto">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Your message has been sent successfully! Our team will respond shortly.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Col: Contact Channels */}
        <div className="space-y-6">
          <div className="bg-white border border-green-50 p-6 rounded-2xl shadow-sm space-y-6">
            <h3 className="font-bold text-stone-900 text-lg border-b border-stone-100 pb-2 flex items-center gap-1.5">
              <Compass className="w-4.5 h-4.5 text-green-600" /> Contact Info
            </h3>
            
            <ul className="space-y-5 text-sm text-stone-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Headquarters</p>
                  <p className="text-stone-500 mt-0.5">102, Green Valley Estate, Anand, Gujarat, India</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Phone Support</p>
                  <p className="text-stone-500 mt-0.5">+91 98765 43210</p>
                  <p className="text-[10px] text-stone-400">Mon-Sat: 9 AM to 6 PM IST</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-900">Email Inquiry</p>
                  <p className="text-stone-500 mt-0.5">support@vgram.org</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-xs text-amber-800 space-y-1.5">
            <p className="font-bold">Are you a Rural Producer?</p>
            <p className="leading-relaxed">For support related to listing crops, setting map coordinates, or shipping, call our toll-free farmer helpline at **1800-FARM-VGRAM**.</p>
          </div>
        </div>

        {/* Right Col: Form Input */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-green-50 p-8 rounded-2xl shadow-sm space-y-5">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-green-600" /> Send a Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-xs focus:outline-none focus:border-green-600 text-stone-850"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-xs focus:outline-none focus:border-green-600 text-stone-850"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Message</label>
              <textarea
                required
                rows={4}
                placeholder="How can we assist you?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-xs focus:outline-none focus:border-green-600 text-stone-850"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-stone-300 text-white font-semibold text-sm px-6 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              {submitting ? 'Sending...' : 'Submit Message'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
