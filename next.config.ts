import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  // Allow access from local network IPs and ports for dev HMR
  allowedDevOrigins: [
    "192.168.1.11",
    "192.168.1.11:3000",
    "192.168.1.11:3001",
    "192.168.1.11:3002",
    "192.168.1.75",
    "10.217.17.192",
    "localhost",
    "127.0.0.1",
  ],
};

export default nextConfig;
