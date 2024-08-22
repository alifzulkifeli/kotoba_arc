// import withPWA from 'next-pwa';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     reactStrictMode: true,      // Enable React strict mode for improved error handling
//     swcMinify: true,            // Enable SWC minification for improved performance
//     compiler: {
//         removeConsole: process.env.NODE_ENV !== 'development'       // Remove console.log in production
//     }
// };

// export default withPWA({
//     dest: "public",         // destination directory for the PWA files
//     disable: process.env.NODE_ENV === "development",        // disable PWA in the development environment
//     register: true,         // register the PWA service worker
//     skipWaiting: true,          // skip waiting for service worker activation
// })(nextConfig);

// /next.config.js
/** @type {import('next').NextConfig} */
const prod = process.env.NODE_ENV === "production";
const withPWA = require("next-pwa")({
  dest: "public",
  disable: prod ? false : true,
});
module.exports = withPWA({
  images: {
    remotePatterns: [ 
      { hostname: `${process.env.NEXT_PUBLIC_CANONICAL}` },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/",
      },
    ];
  },
});