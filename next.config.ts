import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  // Allow access from local network
  allowedDevOrigins: ["192.168.1.75"],
};

export default nextConfig;
