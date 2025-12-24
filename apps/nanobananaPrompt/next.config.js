import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 移除废弃的 domains 配置，只使用 remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "camo.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "pub-387a24462b7d44e395219fe1c8295ad7.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Turbopack 配置（Next.js 16 默认）
  turbopack: {
    resolveAlias: {
      // 应用自己的路径别名（必须以 / 结尾）
      '@/app': path.resolve(__dirname, './app'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/types': path.resolve(__dirname, './types'),
      '@/components': path.resolve(__dirname, './components'),
    },
  },
  // Webpack 配置（兼容 --webpack 模式）
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib': path.resolve(__dirname, '../../packages/web/src/lib'),
      '@/types': path.resolve(__dirname, '../../packages/web/src/types'),
    };
    return config;
  },
  transpilePackages: ['@repo/web'],
};

export default nextConfig;
