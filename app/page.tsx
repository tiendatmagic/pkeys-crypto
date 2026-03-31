'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Key, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import { useRipple, RippleContainer } from '@/components/Ripple';
import { MAX_PAGES } from '@/lib/blockchain';
import { BTC_MAX_PAGES } from '@/lib/bitcoin';
import { BCH_MAX_PAGES } from '@/lib/bitcoincash';
import { LTC_MAX_PAGES } from '@/lib/litecoin';
import { SOL_MAX_PAGES } from '@/lib/solana';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [randomPage, setRandomPage] = useState<bigint>(1n);
  const [randomBtcPage, setRandomBtcPage] = useState<bigint>(1n);
  const [randomBchPage, setRandomBchPage] = useState<bigint>(1n);
  const [randomLtcPage, setRandomLtcPage] = useState<bigint>(1n);
  const [randomSolPage, setRandomSolPage] = useState<bigint>(1n);
  const { ripples, addRipple } = useRipple();

  useEffect(() => {
    setMounted(true);
    // Generate random page only on client using crypto for true randomness
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    
    setRandomPage((BigInt('0x' + hex) % MAX_PAGES) + 1n);
    setRandomBtcPage((BigInt('0x' + hex) % BTC_MAX_PAGES) + 1n);
    setRandomBchPage((BigInt('0x' + hex) % BCH_MAX_PAGES) + 1n);
    setRandomLtcPage((BigInt('0x' + hex) % LTC_MAX_PAGES) + 1n);
    setRandomSolPage((BigInt('0x' + hex) % SOL_MAX_PAGES) + 1n);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-md">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
              Explore the <span className="text-md-primary">Uncountable</span> Universe
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Navigate through $2^{256}$ keys with absolute precision.
              A premium, high-performance explorer for the most secure blockchains.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-24 max-w-none px-0">
                {/* Ethereum Card */}
               <Link
                 href={mounted ? `/ethereum/${randomPage}` : '#'}
                 onMouseDown={addRipple}
                 className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-md-primary/30"
               >
                 <RippleContainer ripples={ripples} />
                 <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-6 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-10 h-10 rounded-full bg-md-primary flex items-center justify-center shadow-md-1">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black mb-3">Ethereum</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Explore Ethereum keys with speed.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-md-primary font-bold text-sm group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                 </div>
               </Link>

                {/* Bitcoin Card */}
               <Link
                 href={mounted ? `/bitcoin/${randomBtcPage}` : '#'}
                 onMouseDown={addRipple}
                 className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-yellow-500/30"
               >
                 <RippleContainer ripples={ripples} />
                 <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center mb-6 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-md-1">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black mb-3">Bitcoin</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Explore Legacy, SegWit, and Taproot.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-yellow-600 dark:text-yellow-500 font-bold text-sm group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                 </div>
               </Link>

                {/* Bitcoin Cash Card */}
                <Link
                  href={mounted ? `/bitcoincash/${randomBchPage}` : '#'}
                  onMouseDown={addRipple}
                  className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-green-500/30"
                >
                  <RippleContainer ripples={ripples} />
                  <div className="p-8 md:p-10 flex flex-col items-center text-center">
                     <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                       <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-md-1">
                         <Key className="w-5 h-5 text-white" />
                       </div>
                     </div>
                     <h2 className="text-2xl font-black mb-3">Bitcoin Cash</h2>
                     <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                       Explore Legacy and CashAddr.
                     </p>
                     <div className="mt-auto flex items-center gap-2 text-green-600 dark:text-green-500 font-bold text-sm group-hover:gap-3 transition-all">
                       Explore <ArrowRight className="w-4 h-4" />
                     </div>
                  </div>
                </Link>

                {/* Litecoin Card */}
                <Link
                  href={mounted ? `/litecoin/${randomLtcPage}` : '#'}
                  onMouseDown={addRipple}
                  className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-blue-500/30"
                >
                  <RippleContainer ripples={ripples} />
                  <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                       <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Ł</span>
                    </div>
                    <h2 className="text-2xl font-black mb-3">Litecoin</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Explore Legacy, SegWit, and Taproot.
                    </p>
                    <div className="mt-auto flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>

               {/* Solana Card */}
               <Link
                 href={mounted ? `/solana/${randomSolPage}` : '#'}
                 onMouseDown={addRipple}
                 className="md-card overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative border-2 border-transparent hover:border-purple-500/30"
               >
                 <RippleContainer ripples={ripples} />
                 <div className="p-8 md:p-10 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6 shadow-md-2 group-hover:scale-110 transition-transform duration-500">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-green-400 flex items-center justify-center shadow-md-1">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black mb-3">Solana</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                      Explore Ed25519 based Solana addresses.
                    </p>
                     <div className="mt-auto flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm group-hover:gap-3 transition-all">
                       Explore <ArrowRight className="w-4 h-4" />
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
