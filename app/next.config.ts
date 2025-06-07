import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pagesでの配信時にbasePath設定が必要な場合は下記を有効化
  // basePath: '/Hiwari',
  // assetPrefix: '/Hiwari/',
};

export default nextConfig;
