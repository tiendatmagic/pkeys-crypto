'use client';

import React, { useState, useEffect } from 'react';
import { getBalance, RPC_ENDPOINTS } from '@/lib/blockchain';
import { getBitcoinBalance } from '@/lib/bitcoin';
import { getSolanaBalance, SOL_RPC_ENDPOINTS } from '@/lib/solana';
import { getBitcoinCashBalance } from '@/lib/bitcoincash';
import { getLitecoinBalance } from '@/lib/litecoin';
import { getTonBalance } from '@/lib/ton';
import { getSuiBalance } from '@/lib/sui';
import { getXrpBalance } from '@/lib/xrp';
import { ethers } from 'ethers';
import { ShieldCheck, Play, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DiagnosticsProps {
  network?: 'ethereum' | 'bitcoin' | 'solana' | 'bitcoincash' | 'litecoin' | 'ton' | 'sui' | 'xrp';
}

export function Diagnostics({ network = 'ethereum' }: DiagnosticsProps) {
  const defaultAddress = network === 'ethereum' 
    ? '0xd8da6bf26964af9d7eed9e03e53415d37aa96045' // Vitalik
    : network === 'bitcoin' 
    ? '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Genesis block
    : network === 'bitcoincash'
    ? 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a' // Known address
    : network === 'litecoin'
    ? 'LhRjN4R8itxZ7Xf52Xf52Xf52Xf52Xf52X' // Known address
    : network === 'ton'
    ? 'EQA277ad8-3404-45fe-926f-897d01566cae' // Replace with a real one
    : network === 'sui'
    ? '0x1eb8784d2847a9fe0277ad8340445fe926f897d01566caed8da6bf26964af9d7' // Replace with a real one
    : network === 'xrp'
    ? 'r9cZA1mLtmjt9J2UqX3He17aM2K2dF4y3h' // Known XRP Genesis/Early address
    : '4zvwRjXUKGivpXN912D8Aht8q7KbcF74HphgmoCtajSs'; // Seed 0 address

  const [address, setAddress] = useState(defaultAddress);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [currentRpc, setCurrentRpc] = useState('');

  // Reset address if network changes
  useEffect(() => {
    setAddress(defaultAddress);
    setStatus('idle');
    setResult(null);
  }, [network, defaultAddress]);

  const runDiagnostic = async () => {
    setStatus('loading');
    
    if (network === 'ethereum') {
      const rpc = RPC_ENDPOINTS[Math.floor(Math.random() * RPC_ENDPOINTS.length)];
      setCurrentRpc(rpc);
      try {
        const provider = new ethers.JsonRpcProvider(rpc);
        const bal = await getBalance(address, provider);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else if (network === 'solana') {
      const rpc = SOL_RPC_ENDPOINTS[Math.floor(Math.random() * SOL_RPC_ENDPOINTS.length)];
      setCurrentRpc(rpc);
      try {
        const bal = await getSolanaBalance(address);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else if (network === 'sui') {
      setCurrentRpc('Sui Mainnet RPC');
      try {
        const bal = await getSuiBalance(address);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else if (network === 'xrp') {
      setCurrentRpc('XRP Ledger RPC');
      try {
        const bal = await getXrpBalance(address);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else if (network === 'ton') {
      setCurrentRpc('TON Center API');
      try {
        const bal = await getTonBalance(address);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    } else {
      setCurrentRpc('blockchain.info API');
      try {
        const bal = await getBitcoinBalance(address);
        if (bal !== null) {
          setResult(bal);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }
  };

  const currencySymbol = network === 'ethereum' ? 'ETH' : 
                         network === 'bitcoin' ? 'BTC' : 
                         network === 'solana' ? 'SOL' : 
                         network === 'bitcoincash' ? 'BCH' :
                         network === 'litecoin' ? 'LTC' :
                         network === 'ton' ? 'TON' : 
                         network === 'sui' ? 'SUI' : 
                         network === 'xrp' ? 'XRP' :
                         'ETH';

  return (
    <div className="my-10 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-xl font-bold text-indigo-900 dark:text-indigo-100">API Diagnostics</h2>
      </div>
      
      <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mb-6">
        Verify that the balance fetching is working correctly by testing a known funded address.
      </p>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={`Enter ${
            network === 'ethereum' ? 'Ethereum' : 
            network === 'bitcoin' ? 'Bitcoin' : 
            network === 'solana' ? 'Solana' : 
            network === 'bitcoincash' ? 'Bitcoin Cash' :
            network === 'litecoin' ? 'Litecoin' :
            network === 'ton' ? 'TON' :
            network === 'sui' ? 'Sui' :
            'XRP'
          } Address`}
          className="flex-1 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-800 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
        />
        <button
          onClick={runDiagnostic}
          disabled={status === 'loading'}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {status === 'loading' ? 'Checking...' : <><Play className="w-4 h-4" /> Run Test</>}
        </button>
      </div>

      {status !== 'idle' && (
        <div className="mt-6 p-4 rounded-xl bg-white/50 dark:bg-black/20 border border-indigo-100 dark:border-indigo-900/50">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Node/API:</span>
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{currentRpc}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success: {result} {currencySymbol}</span>
                </div>
              ) : status === 'error' ? (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>API Error or Rate Limited</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
