'use client';

import React, { useState, useEffect } from 'react';
import { getAddressFromPrivateKey, getBalance } from '@/lib/blockchain';
import { ethers } from 'ethers';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface KeyRowProps {
  index: bigint;
  privateKey: string;
  initialAddress?: string;
  initialBalance?: string | null;
  provider: ethers.JsonRpcProvider;
}

export function KeyRow({ index, privateKey, initialAddress, initialBalance, provider }: KeyRowProps) {
  const [address, setAddress] = useState(initialAddress || '');
  const [balance, setBalance] = useState<string | null>(initialBalance || null);
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState<'pk' | 'addr' | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (initialAddress) {
      setAddress(initialAddress);
    } else {
      setAddress(getAddressFromPrivateKey(privateKey));
    }
  }, [privateKey, initialAddress]);

  useEffect(() => {
    if (initialBalance !== undefined) {
      setBalance(initialBalance);
      setIsError(initialBalance === null);
    }
  }, [initialBalance]);

  const fetchBalance = async (addr: string) => {
    setIsFetching(true);
    setIsError(false);
    const bal = await getBalance(addr, provider);
    if (bal === null) {
      setIsError(true);
    } else {
      setBalance(bal);
    }
    setIsFetching(false);
  };

  const copyToClipboard = (text: string, type: 'pk' | 'addr') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    showToast(`${type === 'pk' ? 'Private key' : 'Address'} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDisplayBalance = (bal: string | null) => {
    if (isFetching && !bal) return '...';
    // Fallback to 0 if error or null, per user request
    const num = bal ? parseFloat(bal) : 0;
    if (num === 0) return '0';
    if (num < 0.00001) return '< 0.00001';
    return num.toLocaleString(undefined, { maximumFractionDigits: 5 });
  };

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
      <td className="py-4 px-4 text-xs font-mono text-gray-400 group-hover:text-indigo-400 transition-colors">
        {index.toString()}
      </td>
      <td className="py-4 px-4">
        <div 
          onClick={() => !isFetching && fetchBalance(address)}
          className={`px-2 py-1 rounded text-xs font-medium inline-block whitespace-nowrap cursor-pointer transition-all ${
            balance && parseFloat(balance) > 0 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 scale-110 shadow-sm' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-80'
          } ${isFetching ? 'animate-pulse' : ''}`}
          title={isError ? 'Rate limited. Click to retry.' : balance ? `${balance} ETH` : 'Fetching balance...'}
        >
          {formatDisplayBalance(balance)}
          {(balance && parseFloat(balance) > 0 ? <span className="ml-1">ETH</span> : <span className="ml-1 opacity-50">ETH</span>)}
        </div>
      </td>
      <td className="py-4 px-4 font-mono text-sm max-w-0 md:max-w-none">
        <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate md:overflow-visible" title={privateKey}>
              {privateKey.replace('0x', '')}
            </span>
            <button 
                onClick={() => copyToClipboard(privateKey, 'pk')}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
                {copied === 'pk' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
            </button>
        </div>
      </td>
      <td className="py-4 px-4 font-mono text-sm">
        <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-indigo-600 dark:text-indigo-400 truncate md:overflow-visible" title={address}>
              {address}
            </span>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                <button 
                    onClick={() => copyToClipboard(address, 'addr')}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                    {copied === 'addr' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <a 
                    href={`https://etherscan.io/address/${address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-gray-400 hover:text-indigo-500"
                >
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
      </td>
    </tr>
  );
}
