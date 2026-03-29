import React from 'react';
import { ShieldAlert, Heart } from 'lucide-react';

export function Footer() {
  const donateAddress = "0x42863a74164440f3384cA82394e891bDb9888888";

  return (
    <footer className="w-full py-12 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 mt-auto">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Security Note */}
        <div className="mb-12 p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
          <div className="flex items-center gap-3 mb-3 text-orange-600 dark:text-orange-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Security Notice</h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Every private key is a potential fortune, but the odds of landing on a funded wallet are
            astronomically low. This tool is for educational purposes only. Never share your real
            private keys or seed phrases with anyone.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          {/* Donate Section */}
          <div className="mb-8 group w-full max-w-sm">
            <div className="flex items-center justify-center gap-2 mb-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Donate to support:</span>
            </div>
            <code className="block p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] sm:text-xs md:text-sm break-all border border-gray-200 dark:border-gray-700 transition-all group-hover:border-emerald-500/30">
              {donateAddress}
            </code>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 mb-8">
            <a
              href="https://github.com/tiendatmagic/pkeys-crypto"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span>Source code</span>
            </a>
            <a
              href="https://github.com/tiendatmagic/pkeys-crypto/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>Star me</span>
            </a>
          </div>

          <div className="text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-[0.2em]">
            © 2026 Pkeys crypto
          </div>
        </div>
      </div>
    </footer>
  );
}
