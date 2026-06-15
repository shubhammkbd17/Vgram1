'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { profileAPI } from '@/lib/api';
import MapPicker from '@/components/map-picker';
import { User, Mail, MapPin, Phone, Save, Loader2, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, refreshUser } = useApp();
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(28.6139);
  const [lng, setLng] = useState(77.2090);
  
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setLat(user.location_lat || 28.6139);
      setLng(user.location_lng || 77.2090);
    }
  }, [user, loading, router]);

  const handleLocationSelect = (selectedLat: number, selectedLng: number, resolvedAddress: string) => {
    setLat(selectedLat);
    setLng(selectedLng);
    if (!address) {
      setAddress(resolvedAddress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await profileAPI.updateProfile(user.id, {
        full_name: fullName,
        address,
        location_lat: lat,
        location_lng: lng,
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to update profile.');
      } else {
        setSuccessMsg('Profile updated successfully!');
        await refreshUser();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3 border-b border-green-100 pb-4">
        <div className="p-2 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <Compass className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-stone-900 leading-tight">My Profile Settings</h1>
          <p className="text-sm text-stone-500">Configure your user information and farm/home map location coordinates.</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 bg-green-50 text-green-700 border border-green-200 text-sm rounded-xl p-4 font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl p-4 font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Col: Info details */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-green-50 flex flex-col items-center text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={user.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.full_name}`} 
              alt={user.full_name || 'Profile'}
              className="w-24 h-24 rounded-full border-2 border-green-600 bg-green-50 shadow-inner mb-4"
            />
            <h3 className="font-bold text-stone-900 text-lg">{fullName || 'New User'}</h3>
            <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mt-1">
              {user.role}
            </span>
            <div className="w-full border-t border-stone-100 mt-5 pt-4 text-left text-xs space-y-2.5 text-stone-500">
              <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
              <p><strong>Phone:</strong> {phone}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-md border border-green-50">
            <h4 className="font-semibold text-stone-800 mb-3 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" /> Map Coordinates
            </h4>
            <div className="text-xs space-y-2 text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
              <p><strong>Latitude:</strong> {lat.toFixed(5)}</p>
              <p><strong>Longitude:</strong> {lng.toFixed(5)}</p>
              <p className="text-[10px] text-stone-400 mt-1">These coordinates will display your products on the map to buyers.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Fields + Map selection */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-green-50 space-y-5">
            <h3 className="text-xl font-bold text-stone-800">Account Information</h3>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Full Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:border-green-600 text-stone-800"
                  />
                </div>
              </div>

              {/* Phone number (Readonly) */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">Phone (Auth Mode)</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    disabled
                    value={phone}
                    className="block w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl bg-stone-100 text-sm text-stone-400 select-none"
                  />
                </div>
              </div>

              {/* Physical Address */}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1.5">
                  {user.role === 'producer' ? 'Farm / Business Address' : 'Delivery Address'}
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter complete postal address..."
                  className="block w-full px-3.5 py-2.5 border border-stone-200 rounded-xl bg-stone-50 text-sm focus:outline-none focus:border-green-600 text-stone-800"
                />
              </div>
            </div>
          </div>

          {/* Map Location Picker section */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-green-50 space-y-4">
            <h3 className="text-xl font-bold text-stone-800 flex items-center gap-1.5">
              <MapPin className="w-5 h-5 text-green-600" /> 
              {user.role === 'producer' ? 'Locate Your Farm on Map' : 'Set Your Delivery Coordinates'}
            </h3>
            <p className="text-xs text-stone-500">
              Drag or click on the map to pin your location. This helps calculation of distance for nearby consumers.
            </p>
            <MapPicker 
              initialLat={lat} 
              initialLng={lng} 
              onLocationSelect={handleLocationSelect} 
            />
          </div>

          {/* Save Profile Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:bg-stone-300"
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Changes
                </>
              )}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
