import type { NextConfig } from 'next'

// Rotas em português para SEO/UX, pastas em inglês para organização do código.
// Ex: /projetos → src/app/(public)/projects/, /animais → src/app/(public)/animals/
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
      { source: '/animais', destination: '/animals' },
      { source: '/animais/:path*', destination: '/animals/:path*' },
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
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
}

export default nextConfig
