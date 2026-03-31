import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';
import cashaddr from 'cashaddrjs';

// Initialize ECPair with bitcoinerlab/secp256k1
bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

/**
 * Derives Bitcoin Cash addresses from a 32-byte hex private key.
 * Returns Legacy and CashAddr formats.
 */
export function deriveBitcoinCashAddresses(privateKeyHex: string) {
    try {
        // Remove '0x' prefix if present
        const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
        const privateKeyBuffer = Buffer.from(cleanHex, 'hex');
        
        const network = bitcoin.networks.bitcoin; // BCH uses same key derivation as BTC
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network });

        // 1. Legacy Address (P2PKH)
        const { address: legacyAddress, hash } = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network,
        });

        // 2. CashAddr Format
        // hash is the hash160 of the public key
        let cashAddress = 'Error';
        if (hash) {
            cashAddress = cashaddr.encode('bitcoincash', 'P2PKH', hash);
        }

        return {
            legacy: legacyAddress || 'N/A',
            cashAddr: cashAddress || 'N/A'
        };
    } catch (e) {
        console.error('BCH address derivation error:', e);
        return { legacy: 'Error', cashAddr: 'Error' };
    }
}

/**
 * Fetches Bitcoin Cash balance using Blockchair API.
 * Returns balance in BCH as a string.
 */
export async function getBitcoinCashBalance(address: string): Promise<string | null> {
    try {
        // Clean address for API (remove bitcoincash: prefix if present)
        const cleanAddr = address.includes(':') ? address.split(':')[1] : address;
        
        const response = await fetch(`https://api.blockchair.com/bitcoin-cash/dashboards/address/${cleanAddr}?limit=0`);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        const addressData = data.data[cleanAddr].address;
        const balanceSatoshi = addressData.balance;
        
        // Convert Satoshi to BCH
        return (balanceSatoshi / 100000000).toFixed(8);
    } catch (e) {
        console.error(`BCH balance fetch error for ${address}:`, e);
        return null;
    }
}

export const BCH_KEYS_PER_PAGE = 128;
// Use the same max keys as Bitcoin/Ethereum
export const BCH_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const BCH_MAX_PAGES = BCH_MAX_KEYS / BigInt(BCH_KEYS_PER_PAGE);
