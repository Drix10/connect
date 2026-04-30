import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        domains: [],
    },
    env: {
        CAD_TRUST_API_URL: "https://rpc.climateactiondata.org/v2",
    },
};

export default nextConfig;
