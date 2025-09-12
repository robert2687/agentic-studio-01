import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    allowedDevOrigins: [
        'http://localhost:9002',
        '6000-firebase-studio-1752573869432.cluster-c23mj7ubf5fxwq6nrbev4ugaxa.cloudworkstations.dev'
    ]
  }
};

export default nextConfig;
