/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.igdb.com', 'lh3.googleusercontent.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/igdb/:path*',
        destination: 'https://api.igdb.com/:path*',
      },
    ];
  },
};

export default nextConfig;
