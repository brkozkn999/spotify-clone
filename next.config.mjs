/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'abundant-beagle-21.convex.cloud',
            },
        ],
    },
};

export default nextConfig;