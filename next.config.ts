/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
  allowedDevOrigins: [
    "localhost:3000",
    "lislock.local:3000",
    "lislock.local"
  ],
};

module.exports = nextConfig;