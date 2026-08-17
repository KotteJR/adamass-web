/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.adamass.se" }],
        destination: "https://adamass.se/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
