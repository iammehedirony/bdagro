import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: process.env.VERCEL === "1" ? undefined : "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
