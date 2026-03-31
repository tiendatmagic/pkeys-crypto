import { Client, deriveAddress } from 'xrpl';
import { Buffer } from 'buffer';
import { ec as EC } from 'elliptic';
import { XRP_RPC_URLS } from './xrp-constants';

// Initialize Elliptic curve for SECP256K1
const secp256k1 = new EC('secp256k1');

/**
 * Derives an XRP address from a 32-byte private key.
 * This implementation derives a compressed public key from the 256-bit seed
 * to ensure every unique private key has a unique XRP address.
 */
export function deriveXrpAddress(privateKeyHex: string): string {
  try {
    const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    
    // 1. Derive compressed public key from private key hex using SECP256K1
    const key = secp256k1.keyFromPrivate(cleanHex, 'hex');
    const publicKey = key.getPublic(true, 'hex').toUpperCase();
    
    // 2. Derive XRP address from the public key
    return deriveAddress(publicKey);
  } catch (e) {
    console.error('XRP address derivation error:', e);
    return 'Error';
  }
}

/**
 * Fetches XRP balance from the XRP Ledger.
 * Returns balance in XRP as a string.
 */
export async function getXrpBalance(address: string): Promise<string | null> {
  const rpcUrl = XRP_RPC_URLS[0]; // Primary cluster
  const client = new Client(rpcUrl);
  
  try {
    await client.connect();
    
    try {
      const response = await client.request({
        command: 'account_info',
        account: address,
        ledger_index: 'validated'
      });
      
      const drops = response.result.account_data.Balance;
      // 1,000,000 drops = 1 XRP
      const xrpBalance = (Number(drops) / 1000000).toString();
      
      return xrpBalance;
    } catch (e: any) {
      // If account is not found, it means it has 0 balance (not activated)
      if (e.data?.error === 'actNotFound' || e.message?.includes('actNotFound')) {
        return '0';
      }
      throw e;
    } finally {
      await client.disconnect();
    }
  } catch (e) {
    console.error(`XRP balance fetch error for ${address}:`, e);
    return null;
  }
}
