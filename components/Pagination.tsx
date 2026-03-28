'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Dices, CornerDownLeft } from 'lucide-react';
import Link from 'next/link';
import { MAX_PAGES } from '@/lib/blockchain';

interface PaginationProps {
  currentPage: bigint;
}

export function Pagination({ currentPage }: PaginationProps) {
  const [mounted, setMounted] = useState(false);
  const [randomPage, setRandomPage] = useState<bigint>(1n);

  const prevPage = currentPage > 1n ? currentPage - 1n : 1n;
  const nextPage = currentPage < MAX_PAGES ? currentPage + 1n : MAX_PAGES;

  useEffect(() => {
    setMounted(true);
    // Generate random page only on client
    const rand = BigInt(Math.floor(Math.random() * 1000000000000000)) % MAX_PAGES + 1n;
    setRandomPage(rand);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 my-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/ethereum/1"
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
          title="First Page"
        >
          <ChevronsLeft className="w-5 h-5" />
        </Link>
        <Link
          href={`/ethereum/${prevPage}`}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <div className="group relative">
            <Link
            href={mounted ? `/ethereum/${randomPage}` : '#'}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25"
            >
            <Dices className="w-5 h-5" />
            <span className="font-medium">Random</span>
            </Link>
        </div>

        <Link
          href={`/ethereum/${nextPage}`}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
        <Link
          href={`/ethereum/${MAX_PAGES}`}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white transition-all"
          title="Last Page"
        >
          <ChevronsRight className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex items-center gap-2 max-w-xs w-full">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Go to page..."
            className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-400"
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
          <CornerDownLeft className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all text-center px-4">
        Page {currentPage.toString()} of {MAX_PAGES.toString()}
      </div>
    </div>
  );
}
