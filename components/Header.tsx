'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Key } from 'lucide-react';
import Link from 'next/link';
import { useRipple, RippleContainer } from './Ripple';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { ripples: logoRipples, addRipple: addLogoRipple } = useRipple();
  const { ripples: toggleRipples, addRipple: addToggleRipple } = useRipple();

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm shadow-md-1 border-b border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          onMouseDown={addLogoRipple}
          className="relative flex items-center gap-3 active:scale-95 transition-transform px-2 py-1 rounded-xl overflow-hidden"
        >
          <RippleContainer ripples={logoRipples} color="rgba(63, 81, 181, 0.2)" />
          <div className="w-10 h-10 rounded-xl bg-md-primary flex items-center justify-center shadow-md-1 relative z-10">
            <Key className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100 relative z-10">
            Pkeys crypto
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden sm:flex items-center gap-1 mr-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/ethereum/1"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Ethereum
            </Link>
            <Link
              href="/bitcoin/1"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Bitcoin
            </Link>
            <Link
              href="/bitcoincash/1"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              BCH
            </Link>
            <Link
              href="/litecoin/1"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Litecoin
            </Link>
            <Link
              href="/solana/1"
              className="px-4 py-2 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Solana
            </Link>
          </nav>

          <button
            onClick={toggleTheme}
            onMouseDown={addToggleRipple}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-90 transition-all text-gray-600 dark:text-gray-400 overflow-hidden"
            aria-label="Toggle Dark Mode"
          >
            <RippleContainer ripples={toggleRipples} color={theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'} />
            <div className="relative z-10">
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
