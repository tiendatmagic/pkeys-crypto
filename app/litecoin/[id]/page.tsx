import React from 'react';
import { Header } from '@/components/Header';
import { KeyTable } from '@/components/KeyTable';
import { Pagination } from '@/components/Pagination';
import { Diagnostics } from '@/components/Diagnostics';
import { LTC_MAX_PAGES } from '@/lib/litecoin';
import { notFound } from 'next/navigation';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LitecoinPage({ params }: PageProps) {
  const { id } = await params;

  let pageId: bigint;
  try {
    pageId = BigInt(id);
    if (pageId < 1n || pageId > LTC_MAX_PAGES) {
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
            Litecoin Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Exploring the vast universe of Litecoin keys. 
            Litecoin uses the same secp256k1 derivation as Bitcoin but with different network parameters.
            There are 2<sup>256</sup> keys represented as <span className="break-all font-mono text-sm opacity-80">{LTC_MAX_PAGES.toString()}</span> pages.
          </p>
        </div>

        <Diagnostics network="litecoin" />
        
        <Pagination currentPage={pageId} network="litecoin" />

        <div className="mt-8">
          <KeyTable page={pageId} network="litecoin" />
        </div>

        <div className="mt-8">
          <Pagination currentPage={pageId} network="litecoin" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
