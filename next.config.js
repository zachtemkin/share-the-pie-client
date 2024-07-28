/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/capture-receipt",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
