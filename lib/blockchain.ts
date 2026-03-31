import { ethers } from 'ethers';

/**
 * Converts a large decimal index (as string or bigint) to a 32-byte hex private key.
 */
export function indexToPrivateKey(index: string | bigint): string {
    const bigIndex = typeof index === 'string' ? BigInt(index) : index;
    // Map index 0 to 0x...00
    const hex = bigIndex.toString(16).padStart(64, '0');
    return '0x' + hex;
}

/**
 * Derives an Ethereum address from a private key.
 */
export function getAddressFromPrivateKey(privateKey: string): string {
    try {
        // Special case for zero key (technically invalid in Ethereum 
        // but used as a placeholder/start in some explorers)
        if (privateKey === '0x' + '0'.repeat(64)) {
            return '0x3f17f1962B36e491b30A40b2405849e597Ba5FB5';
        }
        const wallet = new ethers.Wallet(privateKey);
        return wallet.address;
    } catch (e) {
        return 'Invalid Key';
    }
}

/**
 * Multicall3 Configuration
 */
export const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';
export const MULTICALL_ABI = [
    'function aggregate3(tuple(address target, bool allowFailure, bytes callData)[] calls) view returns (tuple(bool success, bytes returnData)[])'
];

/**
 * Public RPC endpoints for failover.
 */
export const RPC_ENDPOINTS = [
    'https://cloudflare-eth.com',
    'https://eth.llamarpc.com',
    'https://ethereum.publicnode.com',
    'https://rpc.ankr.com/eth'
];

/**
 * Fetches the balance of an Ethereum address.
 */
export async function getBalance(address: string, provider: ethers.JsonRpcProvider): Promise<string | null> {
    try {
        const balance = await provider.getBalance(address);
        return ethers.formatEther(balance);
    } catch (e) {
        console.error('Balance fetch error:', e);
        return null; // Return null to indicate error
    }
}

export const KEYS_PER_PAGE = 128;
export const MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336'); // secp256k1 order - 1
export const MAX_PAGES = MAX_KEYS / BigInt(KEYS_PER_PAGE);
