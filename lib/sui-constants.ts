import { getJsonRpcFullnodeUrl } from '@mysten/sui/jsonRpc';

export const SUI_KEYS_PER_PAGE = 128;
export const SUI_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336');
export const SUI_MAX_PAGES = SUI_MAX_KEYS / BigInt(SUI_KEYS_PER_PAGE);

export const SUI_RPC_URL = getJsonRpcFullnodeUrl('mainnet');
