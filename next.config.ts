import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
                pathname: '/**',
            },
        ],
    },
    env: {
        NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
    },
};

export default nextConfig;
