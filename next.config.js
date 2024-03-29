/** @type {import("next").NextConfig} */

const withPWA = require("next-pwa");


const nextConfig = {
    ...withPWA({
        pwa: {
            dest: "public",
            register: true,
            skipWaiting: true,
        },
    }),
}

module.exports = withPWA(nextConfig)
