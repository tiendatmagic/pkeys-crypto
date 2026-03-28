'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { indexToPrivateKey, getAddressFromPrivateKey, KEYS_PER_PAGE, RPC_ENDPOINTS, MULTICALL_ADDRESS, MULTICALL_ABI } from '@/lib/blockchain';
import { KeyRow } from './KeyRow';
import { ethers } from 'ethers';

interface KeyTableProps {
  page: bigint;
}

export function KeyTable({ page }: KeyTableProps) {
  const [balances, setBalances] = useState<Record<string, string | null>>({});
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  const provider = useMemo(() => {
    const rpc = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
    return new ethers.JsonRpcProvider(rpc);
  }, [page]);

  const keys = useMemo(() => {
    // Start index at 0 for page 1
    const startRange = (page - 1n) * BigInt(KEYS_PER_PAGE);
    return Array.from({ length: KEYS_PER_PAGE }, (_, i) => {
      const index = startRange + BigInt(i);
      const pk = indexToPrivateKey(index);
      return {
        index,
        privateKey: pk,
        address: getAddressFromPrivateKey(pk)
      };
    });
  }, [page]);

  useEffect(() => {
    const fetchAllBalances = async () => {
      setIsBatchLoading(true);
      try {
        const multicall = new ethers.Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
        
        // In MultiCall3, aggregate3 takes calls as {target, allowFailure, callData}
        // eth_getBalance doesn't have a direct contract call, but we can use 
        // the specialized `getEthBalance(address)` function if available on some multicalls, 
        // or just use individual calls IF the provider supports batching.
        // Actually, for native ETH balance, Multicall3 has `getEthBalance(address)`
        
        // Re-check Multicall3 ABI for eth balance
        // If not, we can use a trick or just use individual calls but in a Promise.all 
        // which ethers JsonRpcProvider handles as a batch if configured.
        
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
  }, [keys, provider]);

  return (
    <div className="w-full bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-900/50">
          <tr>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"># Index</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Balance</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Private Key</th>
            <th className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ethereum Address</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <KeyRow 
                key={key.index.toString()} 
                index={key.index} 
                privateKey={key.privateKey} 
                initialAddress={key.address}
                initialBalance={balances[key.address]}
                provider={provider} 
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
