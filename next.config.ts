/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "storage.googleapis.com" }],
  },
  allowedDevOrigins: [
    "http://localhost:4000",
    "http://dublinerhandyman.local:4000",
    "http://lislock.local:4000",
  ],
};

module.exports = nextConfig;
