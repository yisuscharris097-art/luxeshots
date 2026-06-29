/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.filesafe.space' },
      { protocol: 'https', hostname: '**.leadconnectorhq.com' },
      { protocol: 'https', hostname: '**.squarespace-cdn.com' },
      { protocol: 'https', hostname: '**.vimeocdn.com' },
    ],
  },
};
module.exports = nextConfig;
