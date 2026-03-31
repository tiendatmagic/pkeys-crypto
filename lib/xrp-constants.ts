// lib/xrp-constants.ts
export const XRP_KEYS_PER_PAGE = 128;
export const XRP_MAX_KEYS = BigInt('115792089237316195423570985008687907852837564279074904382605163141518161494336'); // 2^256
export const XRP_MAX_PAGES = XRP_MAX_KEYS / BigInt(XRP_KEYS_PER_PAGE);

export const XRP_RPC_URLS = [
  'https://xrplcluster.com',
  'https://s1.ripple.com:51234',
  'https://s2.ripple.com:51234'
];
