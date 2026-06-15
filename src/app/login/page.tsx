'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ArrowRight, Loader2, Leaf } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { loginUser, verifyOtp } = useApp();
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setError(null);
    setLoading(true);
    
    try {
      const result = await loginUser(phone);
      if (result.success) {
        setStep('otp');
        setInfoMsg('OTP sent! Use verification code "123456" for testing.');
      } else {
        setError(result.error?.message || 'Login failed. Make sure number is registered.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setError(null);
    setLoading(true);

    try {
      const result = await verifyOtp(phone, code);
      if (result.user) {
        router.push('/dashboard');
      } else {
        setError(result.error?.message || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-stone-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-green-50">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <span className="p-3 bg-green-50 rounded-full border border-green-200 text-green-700">
              <Leaf className="w-8 h-8" />
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-stone-900">
            Welcome Back to Vgram
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Connect directly with your rural-urban marketplace.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 text-sm rounded-xl p-3.5">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {infoMsg && (
          <div className="bg-amber-50 text-amber-800 border border-amber-200 text-xs rounded-xl p-3">
            <p className="font-semibold">{infoMsg}</p>
          </div>
        )}

        {step === 'phone' ? (
          /* Step 1: Phone Input */
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="phone-number" className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+91 99999 99999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-1.5">
                    Send OTP <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>
            </div>
            
            <div className="text-center text-sm">
              <span className="text-stone-500">New to Vgram? </span>
              <Link href="/signup" className="font-semibold text-green-700 hover:text-green-800 transition-colors">
                Sign up here
              </Link>
            </div>
          </form>
        ) : (
          /* Step 2: OTP Input */
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="otp-code" className="block text-sm font-semibold text-stone-700 mb-1.5">
                  Verification Code (OTP)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="otp-code"
                    name="code"
                    type="text"
                    pattern="\d{6}"
                    required
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-900 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm tracking-widest text-center font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Sending code to {phone}</span>
              <button 
                type="button" 
                onClick={() => setStep('phone')} 
                className="font-semibold text-green-700 hover:underline"
              >
                Change number
              </button>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md disabled:bg-stone-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>Verify & Login</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
