/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // domains: ["theoterra.com"],
    remotePatterns: [
      {
        hostname: "theoterra.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
