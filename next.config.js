/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@school-management/types",
    "@school-management/store",
    "@school-management/ui",
    "@school-management/utils",
    "@school-management/config",
  ],
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://fallback-api.example.com/api";
    return [
      {
        source: "/api/:path*",
        destination: process.env.NODE_ENV === "development" 
          ? "http://localhost:5000/api/:path*"
          : `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;