'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Dices, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { MAX_PAGES } from '@/lib/blockchain';
import { useRipple, RippleContainer } from './Ripple';

interface PaginationProps {
  currentPage: bigint;
}

export function Pagination({ currentPage }: PaginationProps) {
  const [mounted, setMounted] = useState(false);
  const [randomPage, setRandomPage] = useState<bigint>(1n);
  const { ripples: navRipples, addRipple: addNavRipple } = useRipple();
  const { ripples: randomRipples, addRipple: addRandomRipple } = useRipple();

  const prevPage = currentPage > 1n ? currentPage - 1n : 1n;
  const nextPage = currentPage < MAX_PAGES ? currentPage + 1n : MAX_PAGES;

  useEffect(() => {
    setMounted(true);
    // Generate random page only on client
    const rand = BigInt(Math.floor(Math.random() * 1000000000000000)) % MAX_PAGES + 1n;
    setRandomPage(rand);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 my-8 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-900/50 rounded-full shadow-md-1">
        <Link
          href="/ethereum/1"
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="First Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronsLeft className="relative z-10 w-5 h-5" />
        </Link>
        <Link
          href={`/ethereum/${prevPage}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Previous Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronLeft className="relative z-10 w-5 h-5" />
        </Link>

        <Link
          href={mounted ? `/ethereum/${randomPage}` : '#'}
          onMouseDown={addRandomRipple}
          className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-full bg-md-primary text-white hover:bg-primary-light transition-all duration-300 shadow-md-1 hover:shadow-md-2 active:scale-95 group"
        >
          <RippleContainer ripples={randomRipples} />
          <Dices className="relative z-10 w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="relative z-10 font-bold italic">Random</span>
        </Link>

        <Link
          href={`/ethereum/${nextPage}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Next Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronRight className="relative z-10 w-5 h-5" />
        </Link>
        <Link
          href={`/ethereum/${MAX_PAGES}`}
          onMouseDown={addNavRipple}
          className="relative overflow-hidden p-3 rounded-full hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 active:scale-90"
          title="Last Page"
        >
          <RippleContainer ripples={navRipples} color="rgba(0,0,0,0.1)" />
          <ChevronsRight className="relative z-10 w-5 h-5" />
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-xs w-full group">
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
                    if (targetPage >= 1n && targetPage <= MAX_PAGES) {
                        window.location.href = `/ethereum/${targetPage}`;
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
      
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/30 px-5 py-2 rounded-full border border-gray-100 dark:border-gray-800">
        Page <span className="text-md-primary dark:text-primary-light">{currentPage.toString()}</span> of {MAX_PAGES.toString()}
      </div>
    </div>
  );
}
