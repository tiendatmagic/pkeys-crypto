'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Dices, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { MAX_PAGES } from '@/lib/blockchain';
import { BTC_MAX_PAGES } from '@/lib/bitcoin';
import { BCH_MAX_PAGES } from '@/lib/bitcoincash';
import { LTC_MAX_PAGES } from '@/lib/litecoin';
import { TON_MAX_PAGES } from '@/lib/ton';
import { SOL_MAX_PAGES } from '@/lib/solana';
import { useRipple, RippleContainer } from './Ripple';

interface PaginationProps {
  currentPage: string;
  network: 'ethereum' | 'bitcoin' | 'solana' | 'bitcoincash' | 'litecoin' | 'ton';
}

export function Pagination({ currentPage, network = 'ethereum' }: PaginationProps) {
  const currentBigPage = BigInt(currentPage);
  const [mounted, setMounted] = useState(false);
  const [randomPage, setRandomPage] = useState<bigint>(1n);
  const { ripples: navRipples, addRipple: addNavRipple } = useRipple();
  const { ripples: randomRipples, addRipple: addRandomRipple } = useRipple();

  const maxPages = network === 'ethereum' ? MAX_PAGES : 
                   network === 'bitcoin' ? BTC_MAX_PAGES : 
                   network === 'bitcoincash' ? BCH_MAX_PAGES :
                   network === 'litecoin' ? LTC_MAX_PAGES :
                   network === 'ton' ? TON_MAX_PAGES :
                   SOL_MAX_PAGES;
  const baseUrl = network === 'ethereum' ? '/ethereum' : `/${network}`;

  const prevPage = currentBigPage > 1n ? currentBigPage - 1n : 1n;
  const nextPage = currentBigPage < maxPages ? currentBigPage + 1n : maxPages;

  useEffect(() => {
    setMounted(true);
    // Generate random page only on client using crypto for true randomness
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    const rand = (BigInt('0x' + hex) % maxPages) + 1n;
    setRandomPage(rand);
  }, [maxPages]);

  return (
    <div className="flex flex-col items-center gap-6 my-8 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 md:p-1.5 bg-gray-100/50 dark:bg-gray-900/50 rounded-full shadow-md-1 max-w-full">
        <Link
          href={`${baseUrl}/1`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="First Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronsLeft className="relative z-10 w-5 h-5" />
        </Link>
        <Link
          href={`${baseUrl}/${prevPage}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Previous Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronLeft className="relative z-10 w-5 h-5" />
        </Link>

        <Link
          href={mounted ? `${baseUrl}/${randomPage}` : '#'}
          onMouseDown={addRandomRipple}
          className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-full bg-md-primary text-white hover:bg-primary-light transition-all duration-300 shadow-md-1 hover:shadow-md-2 active:scale-95 group"
        >
          <RippleContainer ripples={randomRipples} />
          <Dices className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="relative z-10 font-bold italic">Random</span>
        </Link>

        <Link
          href={`${baseUrl}/${nextPage}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Next Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronRight className="relative z-10 w-5 h-5" />
        </Link>
        <Link
          href={`${baseUrl}/${maxPages}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Last Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronsRight className="relative z-10 w-5 h-5" />
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-[280px] sm:max-w-xs w-full group">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Go to page..."
            className="w-full px-6 py-3.5 rounded-t-xl bg-gray-50 dark:bg-gray-900/50 border-b-2 border-gray-200 dark:border-gray-800 focus:border-md-primary focus:outline-none transition-all duration-300 placeholder:text-gray-400 font-mono text-sm group-hover:bg-gray-100 dark:group-hover:bg-gray-900"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const target = e.target as HTMLInputElement;
                if (target.value) {
                  try {
                    const targetPage = BigInt(target.value);
                    if (targetPage >= 1n && targetPage <= maxPages) {
                        window.location.href = `${baseUrl}/${targetPage}`;
                    }
                  } catch (err) {
                    // Invalid bigint input
                  }
                }
              }
            }}
          />
          <CornerDownLeft className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-hover:text-md-primary transition-colors" />
        </div>
      </div>
      
      <div className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-4 md:px-5 py-2 rounded-2xl md:rounded-full border border-gray-100 dark:border-gray-800 max-w-full break-all text-center mx-4">
        Page <span className="text-md-primary dark:text-primary-light">{currentPage.toString()}</span> of {maxPages.toString()}
      </div>
    </div>
  );
}

