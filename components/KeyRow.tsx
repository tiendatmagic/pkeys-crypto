'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { getAddressFromPrivateKey, getBalance } from '@/lib/blockchain';
import { deriveBitcoinAddresses, getBitcoinBalance } from '@/lib/bitcoin';
import { deriveBitcoinCashAddresses, getBitcoinCashBalance } from '@/lib/bitcoincash';
import { deriveSolanaAddress, getSolanaBalance } from '@/lib/solana';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { ExternalLink, Copy, Check, Info } from 'lucide-react';
import { useToast } from './Toast';

interface KeyRowProps {
  index: bigint;
  privateKey: string;
  initialAddress?: string;
  initialBalance?: string | null;
  provider?: ethers.JsonRpcProvider;
  solanaConnection?: Connection;
  network: 'ethereum' | 'bitcoin' | 'solana' | 'bitcoincash';
}

export function KeyRow({ index, privateKey, initialAddress, initialBalance, provider, solanaConnection, network }: KeyRowProps) {
  const [address, setAddress] = useState(initialAddress || '');
  const [btcAddresses, setBtcAddresses] = useState<{ legacy: string, segwit: string, taproot: string } | null>(null);
  const [bchAddresses, setBchAddresses] = useState<{ legacy: string, cashAddr: string } | null>(null);
  const [balance, setBalance] = useState<string | null>(initialBalance || null);
  const [btcBalances, setBtcBalances] = useState<{ legacy: string | null, segwit: string | null, taproot: string | null }>({ legacy: null, segwit: null, taproot: null });
  const [bchBalances, setBchBalances] = useState<{ legacy: string | null, cashAddr: string | null }>({ legacy: null, cashAddr: null });
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState<'pk' | 'addr' | 'addr-segwit' | 'addr-taproot' | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (network === 'ethereum') {
      if (initialAddress) {
        setAddress(initialAddress);
      } else {
        setAddress(getAddressFromPrivateKey(privateKey));
      }
    } else if (network === 'bitcoin') {
      const btc = deriveBitcoinAddresses(privateKey);
      setBtcAddresses(btc);
      setAddress(btc.segwit); // Default to SegWit for display
    } else if (network === 'bitcoincash') {
      const bch = deriveBitcoinCashAddresses(privateKey);
      setBchAddresses(bch);
      setAddress(bch.cashAddr);
    } else if (network === 'solana') {
      setAddress(deriveSolanaAddress(privateKey));
    }
  }, [privateKey, initialAddress, network]);

  useEffect(() => {
    if (initialBalance !== undefined) {
      if (network === 'ethereum' || network === 'solana' || (network === 'bitcoincash' && initialBalance !== null)) {
        setBalance(initialBalance);
      }
      setIsError(initialBalance === null);
    }
  }, [initialBalance, network]);

  const fetchBalance = async (addr: string, type: 'eth' | 'btc-legacy' | 'btc-segwit' | 'btc-taproot' | 'solana' | 'bch-legacy' | 'bch-cash') => {
    setIsFetching(true);
    setIsError(false);
    
    if (type === 'eth' && provider) {
      const bal = await getBalance(addr, provider);
      if (bal === null) {
        setIsError(true);
      } else {
        setBalance(bal);
      }
    } else if (type === 'solana') {
      const bal = await getSolanaBalance(addr);
      if (bal === null) {
        setIsError(true);
      } else {
        setBalance(bal);
      }
    } else if (type.startsWith('bch')) {
      const bal = await getBitcoinCashBalance(addr);
      if (bal === null) {
        setIsError(true);
      } else {
        if (type === 'bch-legacy') {
          setBchBalances(prev => ({ ...prev, legacy: bal }));
        } else {
          setBchBalances(prev => ({ ...prev, cashAddr: bal }));
          setBalance(bal);
        }
      }
    } else if (type.startsWith('btc')) {
      const bal = await getBitcoinBalance(addr);
      if (bal === null) {
        setIsError(true);
      } else {
        if (type === 'btc-legacy') {
          setBtcBalances(prev => ({ ...prev, legacy: bal }));
        } else if (type === 'btc-segwit') {
          setBtcBalances(prev => ({ ...prev, segwit: bal }));
          setBalance(bal); // Sync main balance with SegWit
        } else {
          setBtcBalances(prev => ({ ...prev, taproot: bal }));
        }
      }
    }
    setIsFetching(false);
  };

  const copyToClipboard = (text: string, type: 'pk' | 'addr' | 'addr-segwit' | 'addr-taproot') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    showToast(`${type === 'pk' ? 'Private key' : 'Address'} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDisplayBalance = (bal: string | null) => {
    if (isFetching && !bal) return '...';
    const num = bal ? parseFloat(bal) : 0;
    if (num === 0) return '0';
    if (num < 0.00001) return '< 0.00001';
    return num.toLocaleString(undefined, { maximumFractionDigits: 5 });
  };

  const currencySymbol = network === 'ethereum' ? 'ETH' : 
                         network === 'bitcoin' ? 'BTC' : 
                         network === 'bitcoincash' ? 'BCH' :
                         'SOL';

  return (
    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-all duration-300 group">
      <td className="py-4 px-2 md:px-6 text-[11px] font-mono text-gray-400 group-hover:text-md-primary transition-colors duration-300">
        {index.toString()}
      </td>
      <td className="hidden sm:table-cell py-4 px-3 md:px-6">
        {network === 'ethereum' || network === 'solana' ? (
          <div 
            onClick={() => !isFetching && fetchBalance(address, network === 'ethereum' ? 'eth' : 'solana')}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 ${
              balance && parseFloat(balance) > 0 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 shadow-md-1 scale-105' 
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60 dark:text-gray-400'
            } ${isFetching ? 'animate-pulse' : 'hover:scale-105 active:scale-95'}`}
            title={isError ? 'Rate limited. Click to retry.' : balance ? `${balance} ${currencySymbol}` : 'Fetching balance...'}
          >
            {formatDisplayBalance(balance)}
            <span className={`ml-1 ${balance && parseFloat(balance) > 0 ? '' : 'opacity-50'}`}>{currencySymbol}</span>
          </div>
        ) : network === 'bitcoincash' ? (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && bchAddresses && fetchBalance(bchAddresses.cashAddr, 'bch-cash')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                bchBalances.cashAddr && parseFloat(bchBalances.cashAddr) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
              title="CashAddr Balance"
            >
              {formatDisplayBalance(bchBalances.cashAddr)}
              <span className="ml-1 opacity-50">C</span>
            </div>
            <div 
              onClick={() => !isFetching && bchAddresses && fetchBalance(bchAddresses.legacy, 'bch-legacy')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                bchBalances.legacy && parseFloat(bchBalances.legacy) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
              title="Legacy Balance"
            >
              {formatDisplayBalance(bchBalances.legacy)}
              <span className="ml-1 opacity-50">L</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && btcAddresses && fetchBalance(btcAddresses.taproot, 'btc-taproot')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.taproot && parseFloat(btcBalances.taproot) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
              title="Taproot Balance"
            >
              {formatDisplayBalance(btcBalances.taproot)}
              <span className="ml-1 opacity-50">T</span>
            </div>
            <div 
              onClick={() => !isFetching && btcAddresses && fetchBalance(btcAddresses.segwit, 'btc-segwit')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.segwit && parseFloat(btcBalances.segwit) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
              title="Native SegWit Balance"
            >
              {formatDisplayBalance(btcBalances.segwit)}
              <span className="ml-1 opacity-50">S</span>
            </div>
            <div 
              onClick={() => !isFetching && btcAddresses && fetchBalance(btcAddresses.legacy, 'btc-legacy')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.legacy && parseFloat(btcBalances.legacy) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
              title="Legacy Balance"
            >
              {formatDisplayBalance(btcBalances.legacy)}
              <span className="ml-1 opacity-50">L</span>
            </div>
          </div>
        )}
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
        {network === 'ethereum' || network === 'solana' ? (
          <div className="flex items-center gap-2 md:gap-3">
              <span className={`${network === 'ethereum' ? 'text-md-primary' : 'text-purple-600 dark:text-purple-400'} whitespace-nowrap text-[11px] md:text-[13px] font-medium block max-w-[70px] sm:max-w-[100px] lg:max-w-none truncate`} title={address}>
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
                      href={network === 'ethereum' ? `https://etherscan.io/address/${address}` : `https://solscan.io/account/${address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:${network === 'ethereum' ? 'text-md-primary' : 'text-purple-500'} transition-all active:scale-75`}
                  >
                      <ExternalLink className="w-3.5 h-3.5" />
                  </a>
              </div>
          </div>
        ) : network === 'bitcoincash' ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">C</span>
                <span className="text-green-600 dark:text-green-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={bchAddresses?.cashAddr}>
                  {bchAddresses?.cashAddr}
                </span>
                <button 
                    onClick={() => copyToClipboard(bchAddresses?.cashAddr || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin-cash/address/${bchAddresses?.cashAddr}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-green-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">L</span>
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={bchAddresses?.legacy}>
                  {bchAddresses?.legacy}
                </span>
                <button 
                    onClick={() => copyToClipboard(bchAddresses?.legacy || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin-cash/address/${bchAddresses?.legacy}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-green-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Taproot */}
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">T</span>
                <span className="text-md-primary dark:text-primary-light text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={btcAddresses?.taproot}>
                  {btcAddresses?.taproot}
                </span>
                <button 
                    onClick={() => copyToClipboard(btcAddresses?.taproot || '', 'addr-taproot')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr-taproot' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${btcAddresses?.taproot}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-md-primary"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             {/* SegWit */}
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">S</span>
                <span className="text-gray-600 dark:text-gray-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={btcAddresses?.segwit}>
                  {btcAddresses?.segwit}
                </span>
                <button 
                    onClick={() => copyToClipboard(btcAddresses?.segwit || '', 'addr-segwit')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr-segwit' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${btcAddresses?.segwit}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-md-primary"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             {/* Legacy */}
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">L</span>
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={btcAddresses?.legacy}>
                  {btcAddresses?.legacy}
                </span>
                <button 
                    onClick={() => copyToClipboard(btcAddresses?.legacy || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${btcAddresses?.legacy}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-md-primary"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
          </div>
        )}
      </td>
    </tr>
  );
}
