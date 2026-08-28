/** @type {import('next').NextConfig} */

// The browser talks straight to Supabase, so the connect-src allowlist is
// derived from the configured project URL rather than hard-coded.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseOrigin = '';
let supabaseSocketOrigin = '';
try {
  if (supabaseUrl) {
    const parsed = new URL(supabaseUrl);
    supabaseOrigin = parsed.origin;
    supabaseSocketOrigin = `wss://${parsed.host}`;
  }
} catch {
  // An unparseable URL simply yields a stricter policy.
}

const isDev = process.env.NODE_ENV !== 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js injects its hydration payload inline; dev additionally evaluates
  // the refresh runtime.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  ["connect-src 'self'", supabaseOrigin, supabaseSocketOrigin]
    .filter(Boolean)
    .join(' '),
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains',
  },
];

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
