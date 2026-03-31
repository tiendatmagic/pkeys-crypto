import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import ecc from '@bitcoinerlab/secp256k1';

// Initialize ECPair with bitcoinerlab/secp256k1
bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

// Litecoin network parameters
export const LITECOIN_NETWORK: bitcoin.networks.Network = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30, // 48: starts with 'L'
  scriptHash: 0x32, // 50: starts with 'M'
  wif: 0xb0,
};

/**
 * Derives Litecoin addresses from a 32-byte hex private key.
 * Support for Legacy, SegWit (M-address), Native SegWit (ltc1), and Taproot (ltc1p).
 */
export function deriveLitecoinAddresses(privateKeyHex: string) {
  try {
    const cleanHex = privateKeyHex.startsWith('0x') ? privateKeyHex.slice(2) : privateKeyHex;
    const privateKeyBuffer = Buffer.from(cleanHex, 'hex');
    const keyPair = ECPair.fromPrivateKey(privateKeyBuffer, { network: LITECOIN_NETWORK });

    // 1. Legacy (P2PKH) - starts with L
    const { address: legacy } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: LITECOIN_NETWORK,
    });

    // 2. SegWit (P2SH-P2WPKH) - often starts with M on LTC
    const { address: segwit } = bitcoin.payments.p2sh({
      redeem: bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: LITECOIN_NETWORK,
      }),
      network: LITECOIN_NETWORK,
    });

    // 3. Native SegWit (Bech32 P2WPKH) - starts with ltc1
    const { address: nativeSegwit } = bitcoin.payments.p2wpkh({
      pubkey: keyPair.publicKey,
      network: LITECOIN_NETWORK,
    });

    // 4. Taproot (P2TR) - starts with ltc1p
    const { address: taproot } = bitcoin.payments.p2tr({
      internalPubkey: keyPair.publicKey.slice(1, 33),
      network: LITECOIN_NETWORK,
    });

    return {
      legacy: legacy || 'N/A',
      segwit: segwit || 'N/A',
      nativeSegwit: nativeSegwit || 'N/A',
      taproot: taproot || 'N/A',
    };
  } catch (e) {
    console.error('Litecoin address derivation error:', e);
    const errorMsg = 'Error';
    return { legacy: errorMsg, segwit: errorMsg, nativeSegwit: errorMsg, taproot: errorMsg };
  }
}

/**
 * Fetches Litecoin balance using Blockchair API.
 */
export async function getLitecoinBalance(address: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.blockchair.com/litecoin/dashboards/address/${address}?limit=0`);
    if (!response.ok) throw new Error('API request failed');
    const data = await response.json();
    const balanceLitoshi = data.data[address].address.balance;
    return (balanceLitoshi / 100000000).toFixed(8);
  } catch (e) {
    console.error(`Litecoin balance fetch error for ${address}:`, e);
    return null;
  }
}

export const LTC_KEYS_PER_PAGE = 128;
export const LTC_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const LTC_MAX_PAGES = LTC_MAX_KEYS / BigInt(LTC_KEYS_PER_PAGE);
