/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.pexels.com', 'www.pexels.com'],
  },
  
  // Optimize fonts
  optimizeFonts: false,
  
  // Disable SWC minification to avoid issues
  swcMinify: false,
  
  // Remove experimental features that are not supported
  experimental: {
    // Only include supported experimental features for Next.js 13.4.19
    appDir: true,
  },
}

module.exports = nextConfig