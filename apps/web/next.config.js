/** @type {import('next').NextConfig} */
const nextConfig = {
     turbopack: {
    root: "/home/roodius/Home/colosseum-Frontier",
    },
    images: {
       remotePatterns: [
         {
           protocol: "https",
           hostname: "lh3.googleusercontent.com",
         },
       ],
     },
};

export default nextConfig;
