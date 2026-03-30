/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify'),
            crypto: require.resolve('crypto-browserify'),
            process: require.resolve('process/browser'),
        };
        config.plugins.push(
            new webpack.ProvidePlugin({
                Buffer: ['buffer', 'Buffer'],
                process: 'process/browser',
            })
        );
    }
    return config;
  },
};

module.exports = nextConfig;
