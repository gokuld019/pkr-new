import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';

const IMG_URL = (
  process.env.NEXT_PUBLIC_IMG_URL || 'https://gurudev.pkrestates.com/backend/storage/'
).replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isProd ? { output: 'export' } : {}),
  trailingSlash: true,
  reactCompiler: true,
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    inlineCss: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
    // If you are proxying requests through Next.js middleware, this is required
    middlewareClientMaxBodySize: '10mb',
  },
  
  // Note: `api.bodyParser` is for the Pages Router. It does not work in the App Router. 
  // For App Router API routes, Next.js defaults to no limit, so 413 errors usually come from a reverse proxy (e.g., Nginx).

  ...(!isProd
    ? {
        async rewrites() {
          return [
            {
              source: '/media-proxy/:path*',
              destination: `${IMG_URL}/:path*`,
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;