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
import { TON_MAX_PAGES } from '@/lib/ton';
import { SUI_MAX_PAGES } from '@/lib/sui-constants';
import { SOL_MAX_PAGES } from '@/lib/solana';

interface RandomPages {
  ethereum: bigint;
  bitcoin: bigint;
  solana: bigint;
  bitcoincash: bigint;
  litecoin: bigint;
  ton: bigint;
  sui: bigint;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [randomPages, setRandomPages] = useState<RandomPages>({
    ethereum: 1n,
    bitcoin: 1n,
    solana: 1n,
    bitcoincash: 1n,
    litecoin: 1n,
    ton: 1n,
    sui: 1n
  });
  const { ripples, addRipple } = useRipple();

  useEffect(() => {
    const getRandomPage = (max: bigint) => BigInt(Math.floor(Math.random() * Number(max))) + 1n;
    try {
      setRandomPages({
        ethereum: getRandomPage(MAX_PAGES),
        bitcoin: getRandomPage(BTC_MAX_PAGES),
        solana: getRandomPage(SOL_MAX_PAGES),
        bitcoincash: getRandomPage(BCH_MAX_PAGES),
        litecoin: getRandomPage(LTC_MAX_PAGES),
        ton: getRandomPage(TON_MAX_PAGES),
        sui: getRandomPage(SUI_MAX_PAGES)
      });
    } catch {
      // Ignore random generation errors
    }
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden font-sans">
      <Header />

      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-md">
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none text-gray-900 dark:text-white">
              Explore the <span className="text-md-primary font-black uppercase">Uncountable</span> Universe
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Navigate through $2^{256}$ keys with absolute precision.
              A premium, high-performance explorer for the most secure blockchains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-24">
            {/* Ethereum Card */}
            <Link 
              href={mounted ? `/ethereum/${randomPages.ethereum.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-md-primary to-indigo-700 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">💎</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Ethereum</h2>
                <p className="mb-6 text-sm font-medium text-indigo-50/80 leading-relaxed">
                  Discover private keys for the world's most popular programmable blockchain.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* Bitcoin Card */}
            <Link 
              href={mounted ? `/bitcoin/${randomPages.bitcoin.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-orange-500 to-red-600 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">₿</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Bitcoin</h2>
                <p className="mb-6 text-sm font-medium text-orange-50/80 leading-relaxed">
                  The original cryptocurrency. Explore billions of possible private key addresses.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* Solana Card */}
            <Link 
              href={mounted ? `/solana/${randomPages.solana.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-purple-600 to-green-400 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">☀️</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Solana</h2>
                <p className="mb-6 text-sm font-medium text-purple-50/80 leading-relaxed">
                  High-speed Ed25519 based blockchain with thousands of transactions per second.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* Bitcoin Cash Card */}
            <Link 
              href={mounted ? `/bitcoincash/${randomPages.bitcoincash.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-green-500 to-emerald-700 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">🟢</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Bitcoin Cash</h2>
                <p className="mb-6 text-sm font-medium text-green-50/80 leading-relaxed">
                  Peer-to-peer electronic cash system. Explore the BCH derivation space.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* Litecoin Card */}
            <Link 
              href={mounted ? `/litecoin/${randomPages.litecoin.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-gray-400 to-slate-600 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">Ł</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Litecoin</h2>
                <p className="mb-6 text-sm font-medium text-gray-50/80 leading-relaxed">
                  The silver to Bitcoin's gold. Optimized for fast and cheap transactions.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* TON Card */}
            <Link 
              href={mounted ? `/ton/${randomPages.ton.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-cyan-400 to-blue-600 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">💎</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">TON</h2>
                <p className="mb-6 text-sm font-medium text-cyan-50/80 leading-relaxed">
                  The Open Network. Telegram's high-performance Layer 1 with smart contracts.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>

            {/* Sui Card */}
            <Link 
              href={mounted ? `/sui/${randomPages.sui.toString()}` : '#'} 
              onMouseDown={addRipple}
              className="group relative block overflow-hidden rounded-3xl bg-linear-to-br from-blue-400 to-cyan-600 p-8 text-white shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
            >
              <RippleContainer ripples={ripples} />
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-all duration-700 group-hover:bg-white/20"></div>
              <div className="relative z-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                  <span className="text-3xl">🧩</span>
                </div>
                <h2 className="mb-2 text-2xl font-black tracking-tight">Sui</h2>
                <p className="mb-6 text-sm font-medium text-blue-50/80 leading-relaxed">
                  Fast and scalable Layer 1 blockchain with Ed25519 cryptography.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white">
                  <span>Enter Explorer</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <ShieldCheck className="w-7 h-7 text-md-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">Math Security</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                Understand the sheer scale of 256-bit encryption. The total address space is larger than the number of atoms in the observable universe.
              </p>
            </div>

            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-black mb-4">v6 Performance</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                Fast, real-time balance checking and address derivation using Next.js 15 and ethers.js v6 with Multicall3 support.
              </p>
            </div>

            <div className="md-card p-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center mb-8 shadow-md-1">
                <Globe className="w-7 h-7 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-2xl font-black mb-4">Unlimited Range</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">
                Go to any page, from the first to the very last, with support for massive BigInt indices and smooth scrolling.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-16 border-t border-gray-100 dark:border-gray-900 mt-20 bg-gray-50/50 dark:bg-gray-950/50 font-sans">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-md-primary flex items-center justify-center shadow-md-1">
              <Key className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">Pkeys crypto</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mb-8 font-bold italic opacity-70">
            Educational tool to visualize the entropy of private keys.
            Never use keys found here for storing real assets.
          </p>
          <div className="text-[11px] font-black text-white uppercase tracking-widest bg-gray-900 dark:bg-md-primary px-8 py-3 rounded-full inline-block shadow-xl">
            Copyright 2026 Pkeys crypto. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
