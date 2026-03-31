import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiJsonRpcClient } from '@mysten/sui/jsonRpc';
import { Buffer } from 'buffer';
import { SUI_RPC_URL } from './sui-constants';

/**
 * Derives a Sui address from a 32-byte private key.
 */
export function deriveSuiAddress(privateKeyHex: string): string {
  try {
    const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    const privateKeyBuffer = Buffer.from(cleanHex, 'hex');
    
    // Create keypair from the 32-byte private key
    const keypair = Ed25519Keypair.fromSecretKey(privateKeyBuffer);
    
    return keypair.getPublicKey().toSuiAddress();
  } catch (e) {
    console.error('SUI address derivation error:', e);
    return 'Error';
  }
}

/**
 * Fetches SUI balance from the official fullnode.
 */
export async function getSuiBalance(address: string): Promise<string | null> {
  try {
    const client = new SuiJsonRpcClient({ 
      url: SUI_RPC_URL,
      network: 'mainnet'
    });
    
    const balance = await client.getBalance({
      owner: address,
      coinType: '0x2::sui::SUI',
    });
    
    const totalMist = BigInt(balance.totalBalance);
    const suiStr = totalMist.toString();
    if (suiStr === '0') return '0';
    
    if (suiStr.length <= 9) {
      return '0.' + suiStr.padStart(9, '0').replace(/0+$/, '') || '0';
    }
    
    const integerPart = suiStr.slice(0, -9);
    const fractionalPart = suiStr.slice(-9).replace(/0+$/, '');
    
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
  } catch (e) {
    console.error(`SUI balance fetch error for ${address}:`, e);
    return null;
  }
}
