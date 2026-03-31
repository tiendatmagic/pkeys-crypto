import React from 'react';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { KeyTable } from '@/components/KeyTable';
import { BTC_MAX_PAGES } from '@/lib/bitcoin';
import { notFound } from 'next/navigation';
import { Diagnostics } from '@/components/Diagnostics';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BitcoinPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const page = BigInt(id);
    if (page < 1n || page > BTC_MAX_PAGES) {
      return notFound();
    }
  } catch {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            Bitcoin Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring the vast universe of Bitcoin keys.
            There are 2<sup>256</sup> keys represented as <span className="break-all font-mono text-sm opacity-80">{BTC_MAX_PAGES.toString()}</span> pages.
          </p>
        </div>

        <Diagnostics network="bitcoin" />

        <Pagination currentPage={id} network="bitcoin" />

        <div className="mt-8">
          <KeyTable page={id} network="bitcoin" />
        </div>

        <div className="mt-8">
          <Pagination currentPage={id} network="bitcoin" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
