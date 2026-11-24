import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Static export only for production builds. In `next dev`, dynamic routes like
// /projects/[slug] are rendered on demand, so you don't hit the
// "missing param in generateStaticParams()" error while developing.
const isProd = process.env.NODE_ENV === 'production';

// Storage base URL comes from .env.local (NEXT_PUBLIC_IMG_URL). Trailing slashes are
// stripped so the rewrite destination is always built the same way.
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
  },

  // Dev-only proxy so the 360° viewer (WebGL) can load images from the API
  // server without hitting CORS. `rewrites()` is not supported together with
  // `output: 'export'`, so it is only added outside production builds.
  // For production, add the CORS header on the API server.
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