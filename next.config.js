/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
