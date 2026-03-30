'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Key, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRipple, RippleContainer } from '@/components/Ripple';
import { MAX_PAGES } from '@/lib/blockchain';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [randomPage, setRandomPage] = useState<bigint>(1n);
  const { ripples, addRipple } = useRipple();

  useEffect(() => {
    setMounted(true);
    // Generate random page only on client using crypto for true randomness
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    const rand = (BigInt('0x' + hex) % MAX_PAGES) + 1n;
    setRandomPage(rand);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-md">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
              Explore the <span className="text-md-primary">Uncountable</span> Universe
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Navigate through $2^{256}$ keys with absolute precision.
              A premium, high-performance explorer for the most secure blockchains.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-24 max-w-4xl mx-auto px-4">
               {/* Ethereum Card */}
               <Link
                 href={mounted ? `/ethereum/${randomPage}` : '#'}
                 onMouseDown={addRipple}
                 className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-md-primary/30"
               >
                 <RippleContainer ripples={ripples} />
                 <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-8 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-12 h-12 rounded-full bg-md-primary flex items-center justify-center shadow-md-1">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black mb-3">Ethereum</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                      Explore Ethereum private keys, addresses and balances with extreme speed.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-md-primary font-bold group-hover:gap-4 transition-all">
                      Start Exploring <ArrowRight className="w-5 h-5" />
                    </div>
                 </div>
               </Link>

               {/* Bitcoin Card */}
               <Link
                 href={mounted ? `/bitcoin/${randomPage}` : '#'}
                 onMouseDown={addRipple}
                 className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-yellow-500/30"
               >
                 <RippleContainer ripples={ripples} />
                 <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center mb-8 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-md-1">
                        <Key className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-black mb-3">Bitcoin</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
                      Explore the world of Bitcoin with full Legacy, Native SegWit, and Taproot support.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold group-hover:gap-4 transition-all">
                      Start Exploring <ArrowRight className="w-5 h-5" />
                    </div>
                 </div>
               </Link>
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
