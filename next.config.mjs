/** @type {import('next').NextConfig} */
const nextConfig = {
	serverExternalPackages: ['@remotion/renderer', '@remotion/bundler'],
	turbopack: {},
};

export default nextConfig;
