import React from 'react';
import { notFound } from 'next/navigation';
import { XRP_MAX_PAGES } from '@/lib/xrp-constants';
import { KeyTable } from '@/components/KeyTable';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { Diagnostics } from '@/components/Diagnostics';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function XrpPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const page = BigInt(id);
    if (page < 1n || page > XRP_MAX_PAGES) {
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
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50">
            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 tracking-wide uppercase">XRP Ledger Explorer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Ripple (XRP) Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Exploring the SECP256K1 universe on the XRP Ledger. Every page reveals 128 unique addresses derived from 32-byte seeds. 
            Total pages: <span className="break-all font-mono text-sm opacity-80">{XRP_MAX_PAGES.toString()}</span>
          </p>
        </div>

        <Diagnostics network="xrp" />
        
        <Pagination currentPage={id} network="xrp" />

        <div className="mt-8">
          <KeyTable page={id} network="xrp" />
        </div>

        <div className="mt-8">
          <Pagination currentPage={id} network="xrp" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
