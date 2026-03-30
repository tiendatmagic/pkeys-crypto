'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { indexToPrivateKey, getAddressFromPrivateKey, KEYS_PER_PAGE, RPC_ENDPOINTS, MULTICALL_ADDRESS, MULTICALL_ABI } from '@/lib/blockchain';
import { BTC_KEYS_PER_PAGE } from '@/lib/bitcoin';
import { KeyRow } from './KeyRow';
import { ethers } from 'ethers';

interface KeyTableProps {
  page: bigint;
  network?: 'ethereum' | 'bitcoin';
}

export function KeyTable({ page, network = 'ethereum' }: KeyTableProps) {
  const [balances, setBalances] = useState<Record<string, string | null>>({});
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  const provider = useMemo(() => {
    if (network !== 'ethereum') return undefined;
    const rpc = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
    return new ethers.JsonRpcProvider(rpc);
  }, [page, network]);

  const keysPerPage = network === 'ethereum' ? KEYS_PER_PAGE : BTC_KEYS_PER_PAGE;

  const keys = useMemo(() => {
    const startRange = (page - 1n) * BigInt(keysPerPage);
    return Array.from({ length: keysPerPage }, (_, i) => {
      const index = startRange + BigInt(i) + (network === 'bitcoin' ? 1n : 0n);
      const pk = indexToPrivateKey(index);
      return {
        index,
        privateKey: pk,
        address: network === 'ethereum' ? getAddressFromPrivateKey(pk) : '' // Handled in KeyRow for BTC
      };
    });
  }, [page, network, keysPerPage]);

  useEffect(() => {
    if (network !== 'ethereum' || !provider) return;

    const fetchAllBalances = async () => {
      setIsBatchLoading(true);
      try {
        const balancePromises = keys.map(k => provider.getBalance(k.address));
        const results = await Promise.all(balancePromises.map(p => p.catch(() => null)));
        
        const newBalances: Record<string, string | null> = {};
        results.forEach((res, i) => {
            if (res !== null) {
                newBalances[keys[i].address] = ethers.formatEther(res);
            } else {
                newBalances[keys[i].address] = null;
            }
        });
        setBalances(newBalances);
      } catch (e) {
        console.error('Batch fetch error:', e);
      }
      setIsBatchLoading(false);
    };

    fetchAllBalances();
  }, [keys, provider, network]);

  return (
    <div className="md-card overflow-hidden w-full max-w-[calc(100vw-2rem)] mx-auto">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
      <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
        <thead className="bg-gray-50/50 dark:bg-gray-900/30">
          <tr>
            <th className="py-5 px-3 md:px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 shrink-0"># Index</th>
            <th className="hidden sm:table-cell py-5 px-3 md:px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 w-32">Balance</th>
            <th className="py-5 px-3 md:px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">Private Key</th>
            <th className="py-5 px-3 md:px-6 text-[11px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
              {network === 'ethereum' ? 'Ethereum Address' : 'Bitcoin Addresses (T: Taproot, S: SegWit, L: Legacy)'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
          {keys.map((key) => (
            <KeyRow 
                key={key.index.toString()} 
                index={key.index} 
                privateKey={key.privateKey} 
                initialAddress={key.address || undefined}
                initialBalance={balances[key.address]}
                provider={provider} 
                network={network}
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

