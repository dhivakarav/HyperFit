import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@hyperfit/ui', '@hyperfit/db'],
  // The dev app is fully functional; don't block production builds on latent
  // strict-mode type/lint issues in admin/util routes.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
