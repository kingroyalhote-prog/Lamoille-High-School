/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/school-board-results/image": [
      "./private/school-board-results/**/*",
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nincxgdepprsvezthqzy.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
}

module.exports = nextConfig
