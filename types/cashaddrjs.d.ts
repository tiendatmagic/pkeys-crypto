declare module 'cashaddrjs' {
    export function encode(prefix: string, type: string, hash: Uint8Array): string;
    export function decode(address: string): { prefix: string, type: string, hash: Uint8Array };
}
