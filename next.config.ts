import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "prod.spline.design",
                port: "",
                pathname: "/**",
            },
            // Add other hostnames if needed, e.g., for placeholder images or other external resources
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default withNextIntl(nextConfig);