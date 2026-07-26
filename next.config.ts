import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export if explicitly building for mobile/native
  output: (process.env.MOBILE_BUILD === "true" ? 'export' : undefined) as "export" | "standalone" | undefined,
  images: {
    unoptimized: true,
  },
};

export default withPWA(nextConfig);
