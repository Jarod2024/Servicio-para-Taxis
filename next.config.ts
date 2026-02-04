import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // --- AGREGA ESTO ---
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
  // ------------------

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;