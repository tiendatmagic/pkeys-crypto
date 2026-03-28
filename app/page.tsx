import React from 'react';
import { Header } from '@/components/Header';
import { Key, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
              Explore the <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">Uncountable</span> Universe of Ethereum
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A premium, high-performance explorer for $2^{256}$ private keys. 
              Find any wallet, check any balance, and navigate through the infinite.
            </p>
            <div className="pt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/ethereum/1"
                className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all shadow-xl hover:shadow-indigo-500/40 flex items-center gap-2 group"
              >
                Start Exploring <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mathematical Security</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Understand the sheer scale of 256-bit encryption. The total address space is larger than the number of atoms in the observable universe.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">High Performance</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Fast, real-time balance checking and address derivation using Next.js 14+ and ethers.js v6.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Unlimited Navigation</h3>
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                Go to any page, from the first to the very last, with support for massive BigInt indices.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Key className="w-5 h-5 text-indigo-600" />
            <span className="text-lg font-bold">Crypto Keys</span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg mx-auto mb-6">
            Educational tool to visualize the entropy of private keys. 
            Never use keys found here for storing real assets.
          </p>
          <div className="text-xs text-gray-400">
            © 2026 Crypto Key Explorer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
