import React from 'react';
import { notFound } from 'next/navigation';
import { SUI_MAX_PAGES } from '@/lib/sui-constants';
import { KeyTable } from '@/components/KeyTable';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { Diagnostics } from '@/components/Diagnostics';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SuiPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const page = BigInt(id);
    if (page < 1n || page > SUI_MAX_PAGES) {
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
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wide uppercase">Sui Network Explorer</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Sui Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Exploring the Ed25519 universe on Sui. Every page reveals 128 unique addresses derived from 32-byte seeds. 
            Total pages: <span className="break-all font-mono text-sm opacity-80">{SUI_MAX_PAGES.toString()}</span>
          </p>
        </div>

        <Diagnostics network="sui" />
        
        <Pagination currentPage={id} network="sui" />

        <div className="mt-8">
          <KeyTable page={id} network="sui" />
        </div>

        <div className="mt-8">
          <Pagination currentPage={id} network="sui" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
