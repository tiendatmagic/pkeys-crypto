import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory, ECPairInterface } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

// Initialize ECPair with tiny-secp256k1
bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

const toXOnly = (pubKey: Uint8Array) => pubKey.slice(1, 33);

/**
 * Derives Bitcoin addresses from a 32-byte hex private key.
 * Returns Legacy (P2PKH), Native SegWit (P2WPKH), and Taproot (P2TR) addresses.
 */
export function deriveBitcoinAddresses(privateKeyHex: string) {
    try {
        // Remove '0x' prefix if present
        const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
        const privateKeyBuffer = Buffer.from(cleanHex, 'hex');
        
        const network = bitcoin.networks.bitcoin;
        const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network });

        // 1. Legacy (P2PKH) - Starts with '1'
        const legacy = bitcoin.payments.p2pkh({
            pubkey: keyPair.publicKey,
            network,
        }).address;

        // 2. Native SegWit (P2WPKH) - Starts with 'bc1q'
        const segwit = bitcoin.payments.p2wpkh({
            pubkey: keyPair.publicKey,
            network,
        }).address;

        // 3. Taproot (P2TR) - Starts with 'bc1p'
        const internalPubkey = toXOnly(keyPair.publicKey);
        const taproot = bitcoin.payments.p2tr({
            internalPubkey,
            network,
        }).address;

        return {
            legacy: legacy || 'N/A',
            segwit: segwit || 'N/A',
            taproot: taproot || 'N/A'
        };
    } catch (e) {
        console.error('Bitcoin address derivation error:', e);
        return { legacy: 'Error', segwit: 'Error', taproot: 'Error' };
    }
}

/**
 * Fetches Bitcoin balance for a given address using Blockchain.info API.
 * Returns balance in BTC as a string.
 */
export async function getBitcoinBalance(address: string): Promise<string | null> {
    try {
        const response = await fetch(`https://blockchain.info/rawaddr/${address}?limit=0`);
        if (!response.ok) throw new Error('API request failed');
        
        const data = await response.json();
        const balanceSatoshi = data.final_balance;
        
        // Convert Satoshi to BTC (1 BTC = 100,000,000 Satoshi)
        return (balanceSatoshi / 100000000).toFixed(8);
    } catch (e) {
        console.error(`Balance fetch error for ${address}:`, e);
        return null;
    }
}

export const BTC_KEYS_PER_PAGE = 128;
// Use the same max keys as Ethereum (secp256k1 order)
export const BTC_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const BTC_MAX_PAGES = BTC_MAX_KEYS / BigInt(BTC_KEYS_PER_PAGE);
