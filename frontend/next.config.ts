import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/projetos', destination: '/projects' },
      { source: '/projetos/:path*', destination: '/projects/:path*' },
      { source: '/contato', destination: '/contact' },
      { source: '/sobre', destination: '/about' },
      { source: '/areas', destination: '/areas' },
      { source: '/areas/:path*', destination: '/areas/:path*' },
      { source: '/transparencia', destination: '/transparency' },
      { source: '/transparencia/:path*', destination: '/transparency/:path*' },
      { source: '/doacoes', destination: '/donations' },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shadcnstudio.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
}

export default nextConfig
