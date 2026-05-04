import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Image optimization
    images: {
        domains: ['upload.wikimedia.org', 'images.unsplash.com'],
    },

    // Environment variables
    env: {
        CAD_TRUST_API_URL: "https://rpc.climateactiondata.org/v2",
    },

    // FIXED: Security headers including CSP
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: https: blob:",
                            "connect-src 'self' https://rpc.climateactiondata.org http://localhost:3000",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                        ].join('; '),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },

    // Performance optimizations for development
    experimental: {
        // Optimize package imports to reduce bundle size
        optimizePackageImports: ['recharts', 'framer-motion', 'lucide-react'],
    },

    // Webpack optimizations
    webpack: (config, { dev, isServer }) => {
        // Only apply optimizations in development
        if (dev && !isServer) {
            // Reduce the number of chunks for faster compilation
            config.optimization = {
                ...config.optimization,
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        default: false,
                        vendors: false,
                        // Group recharts into a single chunk
                        recharts: {
                            name: 'recharts',
                            test: /[\\/]node_modules[\\/](recharts|d3-.*)[\\/]/,
                            priority: 10,
                        },
                        // Group framer-motion into a single chunk
                        framerMotion: {
                            name: 'framer-motion',
                            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                            priority: 10,
                        },
                    },
                },
            };
        }
        return config;
    },
};

export default nextConfig;
