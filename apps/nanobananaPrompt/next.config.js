/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
};

export default nextConfig;
