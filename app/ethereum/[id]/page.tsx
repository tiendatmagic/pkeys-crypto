import React from 'react';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { KeyTable } from '@/components/KeyTable';
import { MAX_PAGES } from '@/lib/blockchain';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

import { Diagnostics } from '@/components/Diagnostics';

export default async function EthereumPage({ params }: PageProps) {
  const { id } = await params;

  let page: bigint;
  try {
    page = BigInt(id);
    if (page < 1n || page > MAX_PAGES) {
      return notFound();
    }
  } catch (e) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Ethereum Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Exploring the vast universe of Ethereum keys.
            There are 2<sup>256</sup> keys represented as {MAX_PAGES.toString()} pages.
          </p>
        </div>

        <Diagnostics />

        <Pagination currentPage={page} />

        <KeyTable page={page} />

        <div className="mt-8">
          <Pagination currentPage={page} />
        </div>

        <div className="mt-12 text-center text-sm text-gray-500 max-w-2xl mx-auto border-t border-gray-200 dark:border-gray-800 pt-8">
          <p className="mb-2 uppercase font-bold tracking-widest text-indigo-500">Security Note</p>
          <p>
            Every private key is a potential fortune, but the odds of landing on a funded wallet are
            astronomically low. This tool is for educational purposes only. Never share your real
            private keys or seed phrases.
          </p>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-400 text-xs">
          © 2026 Pkeys crypto. Inspired by keys.lol.
        </div>
      </footer>
    </div>
  );
}
