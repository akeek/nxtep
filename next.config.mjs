import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(".");
    return config;
  },
  experimental: {
    appDir: true, // Enables experimental App Directory (if applicable)
  },
  async rewrites() {
    return [
      {
        source: "/src/app/utils/screenshots/:path*",
        destination: "/src/app/utils/screenshots/:path*",
      },
      {
        source: "/src/app/utils/pdfs/:path*",
        destination: "/src/app/utils/pdfs/:path*",
      },
    ];
  },
};

export default nextConfig;
