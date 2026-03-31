'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { getAddressFromPrivateKey, getBalance } from '@/lib/blockchain';
import { deriveBitcoinAddresses, getBitcoinBalance } from '@/lib/bitcoin';
import { deriveBitcoinCashAddresses, getBitcoinCashBalance } from '@/lib/bitcoincash';
import { deriveLitecoinAddresses, getLitecoinBalance } from '@/lib/litecoin';
import { deriveSolanaAddress, getSolanaBalance } from '@/lib/solana';
import { deriveTonAddress, getTonBalance } from '@/lib/ton';
import { deriveSuiAddress, getSuiBalance } from '@/lib/sui';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useToast } from './Toast';

interface KeyRowProps {
  index: bigint;
  privateKey: string;
  initialAddress?: string;
  initialBalance?: string | null;
  provider?: ethers.JsonRpcProvider;
  solanaConnection?: Connection;
  network: 'ethereum' | 'bitcoin' | 'solana' | 'bitcoincash' | 'litecoin' | 'ton' | 'sui';
}

interface AddressesState {
    eth?: string;
    sol?: string;
    btc?: { legacy: string, segwit: string, taproot: string };
    bch?: { legacy: string, cashAddr: string };
    ltc?: { legacy: string, segwit: string, nativeSegwit: string, taproot: string };
    ton?: { bounceable: string, nonBounceable: string, raw: string };
    sui?: string;
}

export function KeyRow({ index, privateKey, initialAddress, initialBalance, provider, solanaConnection, network }: KeyRowProps) {
  // Consolidate address state to prevent cascading renders
  const [address, setAddress] = useState(initialAddress || '');
  const [addresses, setAddresses] = useState<AddressesState>({});
  
  const [balance, setBalance] = useState<string | null>(initialBalance || null);
  const [btcBalances, setBtcBalances] = useState<{ legacy: string | null, segwit: string | null, taproot: string | null }>({ legacy: null, segwit: null, taproot: null });
  const [bchBalances, setBchBalances] = useState<{ legacy: string | null, cashAddr: string | null }>({ legacy: null, cashAddr: null });
  const [ltcBalances, setLtcBalances] = useState<{ legacy: string | null, segwit: string | null, nativeSegwit: string | null, taproot: string | null }>({ legacy: null, segwit: null, nativeSegwit: null, taproot: null });
  const [tonBalances, setTonBalances] = useState<{ nonBounceable: string | null, bounceable: string | null }>({ nonBounceable: null, bounceable: null });
  
  const [isError, setIsError] = useState(false);
  const [copied, setCopied] = useState<'pk' | 'addr' | 'addr-segwit' | 'addr-taproot' | 'addr-bounceable' | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const newAddresses: AddressesState = {};
    let mainAddr = '';

    if (network === 'ethereum') {
      mainAddr = initialAddress || getAddressFromPrivateKey(privateKey);
      newAddresses.eth = mainAddr;
    } else if (network === 'bitcoin') {
      const btc = deriveBitcoinAddresses(privateKey);
      newAddresses.btc = btc;
      mainAddr = btc.segwit;
    } else if (network === 'bitcoincash') {
      const bch = deriveBitcoinCashAddresses(privateKey);
      newAddresses.bch = bch;
      mainAddr = bch.cashAddr;
    } else if (network === 'litecoin') {
      const ltc = deriveLitecoinAddresses(privateKey);
      newAddresses.ltc = ltc;
      mainAddr = ltc.segwit;
    } else if (network === 'ton') {
      const ton = deriveTonAddress(privateKey);
      newAddresses.ton = ton;
      mainAddr = ton.nonBounceable;
    } else if (network === 'solana') {
      mainAddr = deriveSolanaAddress(privateKey);
      newAddresses.sol = mainAddr;
    } else if (network === 'sui') {
      mainAddr = deriveSuiAddress(privateKey);
      newAddresses.sui = mainAddr;
    }
    
    setAddress(mainAddr);
    setAddresses(newAddresses);
  }, [privateKey, initialAddress, network]);

  useEffect(() => {
    if (initialBalance !== undefined) {
      if (network === 'ethereum' || network === 'solana' || network === 'sui' || (network === 'bitcoincash' && initialBalance !== null) || (network === 'litecoin' && initialBalance !== null) || (network === 'ton' && initialBalance !== null)) {
        setBalance(initialBalance);
      }
      setIsError(initialBalance === null);
    }
  }, [initialBalance, network]);

  const fetchBalance = async (addr: string, type: string) => {
    setIsFetching(true);
    setIsError(false);
    
    try {
      if (type === 'eth' && provider) {
        const bal = await getBalance(addr, provider);
        if (bal === null) setIsError(true); else setBalance(bal);
      } else if (type === 'solana') {
        const bal = await getSolanaBalance(addr);
        if (bal === null) setIsError(true); else setBalance(bal);
      } else if (type.startsWith('bch')) {
        const bal = await getBitcoinCashBalance(addr);
        if (bal === null) setIsError(true);
        else {
          if (type === 'bch-legacy') setBchBalances(prev => ({ ...prev, legacy: bal }));
          else { setBchBalances(prev => ({ ...prev, cashAddr: bal })); setBalance(bal); }
        }
      } else if (type.startsWith('ltc')) {
        const bal = await getLitecoinBalance(addr);
        if (bal === null) setIsError(true);
        else {
          if (type === 'ltc-legacy') setLtcBalances(prev => ({ ...prev, legacy: bal }));
          else if (type === 'ltc-segwit') { setLtcBalances(prev => ({ ...prev, segwit: bal })); setBalance(bal); }
          else if (type === 'ltc-native') setLtcBalances(prev => ({ ...prev, nativeSegwit: bal }));
          else setLtcBalances(prev => ({ ...prev, taproot: bal }));
        }
      } else if (type.startsWith('btc')) {
        const bal = await getBitcoinBalance(addr);
        if (bal === null) setIsError(true);
        else {
          if (type === 'btc-legacy') setBtcBalances(prev => ({ ...prev, legacy: bal }));
          else if (type === 'btc-segwit') { setBtcBalances(prev => ({ ...prev, segwit: bal })); setBalance(bal); }
          else setBtcBalances(prev => ({ ...prev, taproot: bal }));
        }
      } else if (type === 'ton-non' || type === 'ton-bounce') {
        const bal = await getTonBalance(addr);
        if (bal === null) setIsError(true);
        else {
          if (type === 'ton-non') { setTonBalances(prev => ({ ...prev, nonBounceable: bal })); setBalance(bal); }
          else setTonBalances(prev => ({ ...prev, bounceable: bal }));
        }
      } else if (type === 'sui') {
        const bal = await getSuiBalance(addr);
        if (bal === null) setIsError(true); else setBalance(bal);
      }
    } catch {
      setIsError(true);
    }
    setIsFetching(false);
  };

  const copyToClipboard = (text: string, type: 'pk' | 'addr' | 'addr-segwit' | 'addr-taproot' | 'addr-bounceable') => {
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
                         network === 'litecoin' ? 'LTC' :
                         network === 'ton' ? 'TON' :
                         network === 'sui' ? 'SUI' :
                         'SOL';

  return (
    <tr className="hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-all duration-300 group">
      <td className="py-4 px-2 md:px-6 text-[11px] font-mono text-gray-400 group-hover:text-md-primary transition-colors duration-300">
        {index.toString()}
      </td>
      <td className="hidden sm:table-cell py-4 px-3 md:px-6">
        {network === 'ethereum' || network === 'solana' || network === 'sui' ? (
          <div 
            onClick={() => !isFetching && fetchBalance(address, network === 'ethereum' ? 'eth' : network === 'solana' ? 'solana' : 'sui')}
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
        ) : network === 'ton' ? (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && addresses.ton && fetchBalance(addresses.ton.nonBounceable, 'ton-non')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                tonBalances.nonBounceable && parseFloat(tonBalances.nonBounceable) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(tonBalances.nonBounceable)}
              <span className="ml-1 opacity-50">U</span>
            </div>
            <div 
              onClick={() => !isFetching && addresses.ton && fetchBalance(addresses.ton.bounceable, 'ton-bounce')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                tonBalances.bounceable && parseFloat(tonBalances.bounceable) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(tonBalances.bounceable)}
              <span className="ml-1 opacity-50">E</span>
            </div>
          </div>
        ) : network === 'bitcoincash' ? (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && addresses.bch && fetchBalance(addresses.bch.cashAddr, 'bch-cash')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                bchBalances.cashAddr && parseFloat(bchBalances.cashAddr) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(bchBalances.cashAddr)}
              <span className="ml-1 opacity-50">C</span>
            </div>
            <div 
              onClick={() => !isFetching && addresses.bch && fetchBalance(addresses.bch.legacy, 'bch-legacy')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                bchBalances.legacy && parseFloat(bchBalances.legacy) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(bchBalances.legacy)}
              <span className="ml-1 opacity-50">L</span>
            </div>
          </div>
        ) : network === 'litecoin' ? (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && addresses.ltc && fetchBalance(addresses.ltc.segwit, 'ltc-segwit')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                ltcBalances.segwit && parseFloat(ltcBalances.segwit) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(ltcBalances.segwit)}
              <span className="ml-1 opacity-50">S</span>
            </div>
            <div 
              onClick={() => !isFetching && addresses.ltc && fetchBalance(addresses.ltc.legacy, 'ltc-legacy')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                ltcBalances.legacy && parseFloat(ltcBalances.legacy) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(ltcBalances.legacy)}
              <span className="ml-1 opacity-50">L</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <div 
              onClick={() => !isFetching && addresses.btc && fetchBalance(addresses.btc.taproot, 'btc-taproot')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.taproot && parseFloat(btcBalances.taproot) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(btcBalances.taproot)}
              <span className="ml-1 opacity-50">T</span>
            </div>
            <div 
              onClick={() => !isFetching && addresses.btc && fetchBalance(addresses.btc.segwit, 'btc-segwit')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.segwit && parseFloat(btcBalances.segwit) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
            >
              {formatDisplayBalance(btcBalances.segwit)}
              <span className="ml-1 opacity-50">S</span>
            </div>
            <div 
              onClick={() => !isFetching && addresses.btc && fetchBalance(addresses.btc.legacy, 'btc-legacy')}
              className={`px-2 py-1 rounded-full text-[10px] font-bold inline-flex items-center cursor-pointer transition-all duration-300 w-fit ${
                btcBalances.legacy && parseFloat(btcBalances.legacy) > 0 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40' 
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-800/60'
              } ${isFetching ? 'animate-pulse' : 'hover:scale-105'}`}
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
        {network === 'ethereum' || network === 'solana' || network === 'sui' ? (
          <div className="flex items-center gap-2 md:gap-3">
              <span className={`${network === 'ethereum' ? 'text-md-primary' : network === 'sui' ? 'text-blue-500' : 'text-purple-600 dark:text-purple-400'} whitespace-nowrap text-[11px] md:text-[13px] font-medium block max-w-[70px] sm:max-w-[100px] lg:max-w-none truncate`} title={address}>
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
                      href={network === 'ethereum' ? `https://etherscan.io/address/${address}` : network === 'sui' ? `https://suiscan.xyz/mainnet/address/${address}` : `https://solscan.io/account/${address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:${network === 'ethereum' ? 'text-md-primary' : network === 'sui' ? 'text-blue-500' : 'text-purple-500'} transition-all active:scale-75`}
                  >
                      <ExternalLink className="w-3.5 h-3.5" />
                  </a>
              </div>
          </div>
        ) : network === 'ton' ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">U</span>
                <span className="text-blue-600 dark:text-blue-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.ton?.nonBounceable}>
                  {addresses.ton?.nonBounceable}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.ton?.nonBounceable || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://tonscan.org/address/${addresses.ton?.nonBounceable}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">E</span>
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.ton?.bounceable}>
                  {addresses.ton?.bounceable}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.ton?.bounceable || '', 'addr-bounceable')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr-bounceable' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://tonscan.org/address/${addresses.ton?.bounceable}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
          </div>
        ) : network === 'bitcoincash' ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">C</span>
                <span className="text-green-600 dark:text-green-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.bch?.cashAddr}>
                  {addresses.bch?.cashAddr}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.bch?.cashAddr || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin-cash/address/${addresses.bch?.cashAddr}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-green-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">L</span>
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.bch?.legacy}>
                  {addresses.bch?.legacy}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.bch?.legacy || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin-cash/address/${addresses.bch?.legacy}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-green-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
          </div>
        ) : network === 'litecoin' ? (
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">S</span>
                <span className="text-blue-600 dark:text-blue-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.ltc?.segwit}>
                  {addresses.ltc?.segwit}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.ltc?.segwit || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/litecoin/address/${addresses.ltc?.segwit}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
                >
                    <ExternalLink className="w-2.5 h-2.5" />
                </a>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 w-4">L</span>
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.ltc?.legacy}>
                  {addresses.ltc?.legacy}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.ltc?.legacy || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/litecoin/address/${addresses.ltc?.legacy}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-500"
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
                <span className="text-md-primary dark:text-primary-light text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.btc?.taproot}>
                  {addresses.btc?.taproot}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.btc?.taproot || '', 'addr-taproot')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr-taproot' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${addresses.btc?.taproot}`} 
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
                <span className="text-gray-600 dark:text-gray-400 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.btc?.segwit}>
                  {addresses.btc?.segwit}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.btc?.segwit || '', 'addr-segwit')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr-segwit' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${addresses.btc?.segwit}`} 
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
                <span className="text-gray-500 dark:text-gray-500 text-[11px] md:text-[12px] font-medium truncate max-w-[120px] md:max-w-none" title={addresses.btc?.legacy}>
                  {addresses.btc?.legacy}
                </span>
                <button 
                    onClick={() => copyToClipboard(addresses.btc?.legacy || '', 'addr')}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-75"
                >
                    {copied === 'addr' ? <Check className="w-2.5 h-2.5 text-green-500" /> : <Copy className="w-2.5 h-2.5 text-gray-400" />}
                </button>
                <a 
                    href={`https://blockchair.com/bitcoin/address/${addresses.btc?.legacy}`} 
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
