'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { indexToPrivateKey, getAddressFromPrivateKey, KEYS_PER_PAGE, RPC_ENDPOINTS, MULTICALL_ADDRESS, MULTICALL_ABI } from '@/lib/blockchain';
import { BTC_KEYS_PER_PAGE } from '@/lib/bitcoin';
import { BCH_KEYS_PER_PAGE, deriveBitcoinCashAddresses } from '@/lib/bitcoincash';
import { LTC_KEYS_PER_PAGE, deriveLitecoinAddresses } from '@/lib/litecoin';
import { SOL_KEYS_PER_PAGE, deriveSolanaAddress, SOL_RPC_ENDPOINTS } from '@/lib/solana';
import { TON_KEYS_PER_PAGE, deriveTonAddress } from '@/lib/ton';
import { KeyRow } from './KeyRow';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';

interface KeyTableProps {
  page: string;
  network?: 'ethereum' | 'bitcoin' | 'solana' | 'bitcoincash' | 'litecoin' | 'ton';
}

export function KeyTable({ page, network = 'ethereum' }: KeyTableProps) {
  const pageBigInt = BigInt(page);
  const [balances, setBalances] = useState<Record<string, string | null>>({});
  const [isBatchLoading, setIsBatchLoading] = useState(false);

  const provider = useMemo(() => {
    if (network === 'bitcoin' || network === 'solana' || network === 'bitcoincash' || network === 'litecoin') return undefined;
    const rpc = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
    return new ethers.JsonRpcProvider(rpc);
  }, [pageBigInt, network]);

  const solanaConnection = useMemo(() => {
    if (network !== 'solana') return undefined;
    const rpc = SOL_RPC_ENDPOINTS[Math.floor(Math.random() * SOL_RPC_ENDPOINTS.length)];
    return new Connection(rpc, 'confirmed');
  }, [pageBigInt, network]);

  const keysPerPage = network === 'ethereum' ? KEYS_PER_PAGE : 
                      network === 'bitcoin' ? BTC_KEYS_PER_PAGE : 
                      network === 'bitcoincash' ? BCH_KEYS_PER_PAGE :
                      network === 'litecoin' ? LTC_KEYS_PER_PAGE :
                      network === 'ton' ? TON_KEYS_PER_PAGE :
                      SOL_KEYS_PER_PAGE;

  const keys = useMemo(() => {
    const startRange = (pageBigInt - 1n) * BigInt(keysPerPage);
    return Array.from({ length: keysPerPage }, (_, i) => {
      const index = startRange + BigInt(i) + (network === 'bitcoin' || network === 'bitcoincash' || network === 'litecoin' ? 1n : 0n);
      const pk = indexToPrivateKey(index);
      let address = '';
      if (network === 'ethereum') address = getAddressFromPrivateKey(pk);
      if (network === 'solana') address = deriveSolanaAddress(pk);
      if (network === 'bitcoincash') address = deriveBitcoinCashAddresses(pk).cashAddr;
      if (network === 'litecoin') address = deriveLitecoinAddresses(pk).segwit;
      if (network === 'ton') address = deriveTonAddress(pk).nonBounceable;
      
      return {
        index,
        privateKey: pk,
        address
      };
    });
  }, [pageBigInt, network, keysPerPage]);

  useEffect(() => {
    if (network === 'ethereum' && provider) {
      const fetchAllBalancesEth = async () => {
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

      fetchAllBalancesEth();
    } else if (network === 'solana' && solanaConnection) {
      const fetchAllBalancesSol = async () => {
        setIsBatchLoading(true);
        try {
          const pubkeys = keys.map(k => new PublicKey(k.address));
          // Reduce chunk size to 10 for maximum compatibility with public RPCs
          const chunkSize = 10;
          const chunks = [];
          for (let i = 0; i < pubkeys.length; i += chunkSize) {
            chunks.push(pubkeys.slice(i, i + chunkSize));
          }
          
          const results: (any)[] = [];
          for (const chunk of chunks) {
            try {
              // Standard public nodes have very low limits for getMultipleAccounts
              const accounts = await solanaConnection.getMultipleAccountsInfo(chunk);
              results.push(...accounts);
              // Small jitter delay
              await new Promise(resolve => setTimeout(resolve, 150));
            } catch (chunkError: any) {
              console.error('Solana chunk fetch failed:', chunkError);
              // If we get a 403/429, we mark this chunk as null (triggering individual retry UI)
              results.push(...new Array(chunk.length).fill(null));
              // Longer delay if we hit an error
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
          
          const newBalances: Record<string, string | null> = {};
          results.forEach((account, i) => {
            if (account && account.lamports !== undefined) {
              newBalances[keys[i].address] = (account.lamports / 1e9).toString();
            } else if (results[i] === null) {
              newBalances[keys[i].address] = null; // Error state
            } else {
              newBalances[keys[i].address] = "0"; // Non-existent account
            }
          });
          setBalances(newBalances);
        } catch (e) {
          console.error('Solana overall batch fetch error:', e);
          const newBalances: Record<string, string | null> = {};
          keys.forEach(k => newBalances[k.address] = null); 
          setBalances(newBalances);
        }
        setIsBatchLoading(false);
      };

      fetchAllBalancesSol();
    }
  }, [keys, provider, solanaConnection, network]);

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
              {network === 'ethereum' ? 'Ethereum Address' : 
               network === 'bitcoin' ? 'Bitcoin Addresses (T: Taproot, S: SegWit, L: Legacy)' : 
               network === 'bitcoincash' ? 'Bitcoin Cash Addresses (C: CashAddr, L: Legacy)' :
               network === 'litecoin' ? 'Litecoin Addresses (T: Taproot, S: SegWit, L: Legacy)' :
               network === 'ton' ? 'TON Addresses' :
               'Solana Address (Base58)'}
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
                solanaConnection={solanaConnection}
                network={network}
            />
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

