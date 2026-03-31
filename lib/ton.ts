import { WalletContractV4, Address } from '@ton/ton';
import { keyPairFromSeed } from '@ton/crypto';

/**
 * TON (The Open Network) Constants
 */
export const TON_KEYS_PER_PAGE = 128;
// Use the same max keys as other networks (2^256)
export const TON_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const TON_MAX_PAGES = TON_MAX_KEYS / BigInt(TON_KEYS_PER_PAGE);

/**
 * Derives TON addresses from a 32-byte private key.
 * Uses Wallet V4R2 (Standard).
 * Returns both Bounceable (EQ...) and Non-bounceable (UQ...) addresses.
 */
export function deriveTonAddress(privateKeyHex: string) {
  try {
    const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    const privateKeyBuffer = Buffer.from(cleanHex, 'hex');
    
    // Derive Ed25519 key pair
    const keyPair = keyPairFromSeed(privateKeyBuffer);
    
    // Create Wallet V4R2 instance
    const wallet = WalletContractV4.create({
      publicKey: keyPair.publicKey,
      workchain: 0,
    });
    
    return {
      bounceable: wallet.address.toString({ bounceable: true, testOnly: false }),
      nonBounceable: wallet.address.toString({ bounceable: false, testOnly: false }),
      raw: wallet.address.toRawString(),
    };
  } catch (e) {
    console.error('TON address derivation error:', e);
    return { bounceable: 'Error', nonBounceable: 'Error', raw: 'Error' };
  }
}

/**
 * Fetches TON balance from Tonhub API.
 * Returns balance in TON as a string.
 */
export async function getTonBalance(address: string): Promise<string | null> {
  try {
    // We use mainnet.tonhubapi.com as it's very consistent and doesn't require API key for basic usage
    const response = await fetch(`https://mainnet.tonhubapi.com/address/${address}`);
    if (!response.ok) throw new Error('TON API request failed');
    
    const data = await response.json();
    const nanoTon = BigInt(data.balance);
    
    // Convert NanoTON (10^9) to TON
    const tonStr = nanoTon.toString();
    if (tonStr === '0') return '0';
    
    if (tonStr.length <= 9) {
      return '0.' + tonStr.padStart(9, '0');
    }
    
    const integerPart = tonStr.slice(0, -9);
    const fractionalPart = tonStr.slice(-9).replace(/0+$/, ''); // Remove trailing zeros
    
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
  } catch (e) {
    console.error(`TON balance fetch error for ${address}:`, e);
    return null;
  }
}
