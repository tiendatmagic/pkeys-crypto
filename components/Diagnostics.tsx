'use client';

import React, { useState } from 'react';
import { getBalance, RPC_ENDPOINTS } from '@/lib/blockchain';
import { ethers } from 'ethers';
import { ShieldCheck, Play, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Diagnostics() {
  const [address, setAddress] = useState('0xd8da6bf26964af9d7eed9e03e53415d37aa96045'); // Vitalik's address
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [currentRpc, setCurrentRpc] = useState('');

  const runDiagnostic = async () => {
    setStatus('loading');
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
    } catch (e) {
      setStatus('error');
    }
  };

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
          placeholder="Enter Ethereum Address"
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
              <span className="text-gray-500">Node:</span>
              <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">{currentRpc}</span>
            </div>
            
            <div className="flex items-center gap-2">
              {status === 'success' ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success: {result} ETH</span>
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
