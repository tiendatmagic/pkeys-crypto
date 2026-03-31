import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import bs58 from 'bs58';

/**
 * Derives a Solana address (PublicKey) from a 32-byte hex private key (seed).
 */
export function deriveSolanaAddress(privateKeyHex: string): string {
    try {
        // Remove '0x' prefix if present
        const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
        const seed = Uint8Array.from(Buffer.from(cleanHex, 'hex'));
        
        // Solana's Keypair.fromSeed accepts a 32-byte seed
        const keypair = Keypair.fromSeed(seed);
        return keypair.publicKey.toBase58();
    } catch (e) {
        console.error('Solana address derivation error:', e);
        return 'Invalid Key';
    }
}

/**
 * Public Solana RPC endpoints.
 */
export const SOL_RPC_ENDPOINTS = [
    'https://solana-mainnet.rpc.extnode.com',
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana',
    'https://solana.publicnode.com',
    'https://ssc-dao.genesysgo.net'
];

/**
 * Fetches the balance of a Solana address.
 */
export async function getSolanaBalance(address: string): Promise<string | null> {
    try {
        const rpc = SOL_RPC_ENDPOINTS[Math.floor(Math.random() * SOL_RPC_ENDPOINTS.length)];
        const connection = new Connection(rpc, 'confirmed');
        const publicKey = new PublicKey(address);
        const balance = await connection.getBalance(publicKey);
        
        return (balance / LAMPORTS_PER_SOL).toString();
    } catch (e) {
        console.error(`Solana balance fetch error for ${address}:`, e);
        return null;
    }
}

export const SOL_KEYS_PER_PAGE = 128;
// Use same max keys as Ethereum/Bitcoin for consistency
export const SOL_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const SOL_MAX_PAGES = SOL_MAX_KEYS / BigInt(SOL_KEYS_PER_PAGE);
