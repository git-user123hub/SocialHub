/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jsnsjnfwoaokfshkogam.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/post_images/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "jsnsjnfwoaokfshkogam.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/avatars/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
