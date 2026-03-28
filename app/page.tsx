'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Key, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRipple, RippleContainer } from '@/components/Ripple';

export default function Home() {
  const { ripples, addRipple } = useRipple();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-md">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
              Explore the <span className="text-md-primary">Uncountable</span> Universe
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              A premium, high-performance explorer built on Material Design 3.
              Navigate through $2^{256}$ keys with absolute precision.
            </p>
            <div className="pt-8 flex flex-wrap justify-center gap-6">
              <Link
                href="/ethereum/1"
                onMouseDown={addRipple}
                className="relative overflow-hidden px-10 py-5 rounded-full bg-md-primary text-white font-bold text-lg hover:bg-primary-light transition-all shadow-md-3 hover:shadow-md-4 active:scale-95 flex items-center gap-3 group"
              >
                <RippleContainer ripples={ripples} />
                <span className="relative z-10 flex items-center gap-3">
                  Start Exploring <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <ShieldCheck className="w-7 h-7 text-md-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Math Security</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Understand the sheer scale of 256-bit encryption. The total address space is larger than the number of atoms in the observable universe.
              </p>
            </div>

            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">v6 Performance</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Fast, real-time balance checking and address derivation using Next.js 15 and ethers.js v6 with Multicall3 support.
              </p>
            </div>

            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <Globe className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Unlimited Range</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                Go to any page, from the first to the very last, with support for massive BigInt indices and smooth scrolling.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-gray-100 dark:border-gray-900 mt-20 bg-gray-50/50 dark:bg-gray-950/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-md-primary flex items-center justify-center shadow-md-1">
              <Key className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Pkeys crypto</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mb-8 font-medium italic">
            Educational tool to visualize the entropy of private keys.
            Never use keys found here for storing real assets.
          </p>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-white dark:bg-gray-900 px-6 py-2 rounded-full inline-block shadow-md-1">
            Copyright 2026 Pkeys crypto. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
