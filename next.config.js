/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enable strict mode during development
  images: {
    domains: ['localhost'], // Add any production domains here
  },
};

module.exports = nextConfig;
