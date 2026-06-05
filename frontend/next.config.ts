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
      { source: '/blog', destination: '/blog' },
      { source: '/blog/:path*', destination: '/blog/:path*' },
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
          hostname: 'pub-e0906c54ab2e40c3b57dcede9bde7de0.r2.dev',
        },
        {
          protocol: 'https',
          hostname: 'cdn.ascesa.org',
        },
    ],
  },
}

export default nextConfig
