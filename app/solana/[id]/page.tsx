import React from 'react';
import { Header } from '@/components/Header';
import { Pagination } from '@/components/Pagination';
import { KeyTable } from '@/components/KeyTable';
import { SOL_MAX_PAGES } from '@/lib/solana';
import { notFound } from 'next/navigation';
import { Diagnostics } from '@/components/Diagnostics';
import { Footer } from '@/components/Footer';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SolanaPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const page = BigInt(id);
    if (page < 1n || page > SOL_MAX_PAGES) {
      return notFound();
    }
  } catch {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-gradient-to-tr from-purple-600 to-green-500 bg-clip-text text-transparent">
            Solana Private Keys
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Exploring the Ed25519 universe. Every page reveals 256 unique Solana addresses derived from 32-byte seeds. 
            Total pages: <span className="break-all font-mono text-sm opacity-80">{SOL_MAX_PAGES.toString()}</span>
          </p>
        </div>

        <Diagnostics network="solana" />
        
        <Pagination currentPage={id} network="solana" />

        <div className="mt-12">
          <KeyTable page={id} network="solana" />
        </div>

        <div className="mt-12">
          <Pagination currentPage={id} network="solana" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
