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
    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-all duration-300 group">
      <td className="py-4 px-2 md:px-6 text-[11px] font-mono text-gray-400 group-hover:text-md-primary transition-colors duration-300">
        {index.toString()}
      </td>
      <td className="hidden sm:table-cell py-4 px-3 md:px-6">
        <div 
          onClick={() => !isFetching && fetchBalance(address)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 ${
            balance && parseFloat(balance) > 0 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-md-1 scale-105' 
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400'
          } ${isFetching ? 'animate-pulse' : 'hover:scale-105 active:scale-95'}`}
          title={isError ? 'Rate limited. Click to retry.' : balance ? `${balance} ETH` : 'Fetching balance...'}
        >
          {formatDisplayBalance(balance)}
          {(balance && parseFloat(balance) > 0 ? <span className="ml-1">ETH</span> : <span className="ml-1 opacity-50">ETH</span>)}
        </div>
      </td>
      <td className="py-4 px-3 md:px-6 font-mono text-sm leading-none">
        <div className="flex items-center gap-2 md:gap-3">
            <span className="whitespace-nowrap text-[11px] md:text-[13px] text-gray-600 dark:text-gray-300 tracking-tight block max-w-[80px] sm:max-w-[120px] lg:max-w-none truncate" title={privateKey}>
              {privateKey.replace('0x', '')}
            </span>
            <button 
                onClick={() => copyToClipboard(privateKey, 'pk')}
                className="w-8 h-8 flex items-center justify-center rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-75 shrink-0"
            >
                {copied === 'pk' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
            </button>
        </div>
      </td>
      <td className="py-4 px-3 md:px-6 font-mono text-sm leading-none">
        <div className="flex items-center gap-2 md:gap-3">
            <span className="text-md-primary dark:text-primary-light whitespace-nowrap text-[11px] md:text-[13px] font-medium block max-w-[70px] sm:max-w-[100px] lg:max-w-none truncate" title={address}>
              {address}
            </span>
            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-200 shrink-0">
                <button 
                    onClick={() => copyToClipboard(address, 'addr')}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://etherscan.io/address/${address}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-md-primary transition-all active:scale-75"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
        </div>
      </td>
    </tr>
  );
}
