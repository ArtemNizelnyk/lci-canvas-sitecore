/** @type {import('next').NextConfig} */
const regions = require('./src/constants/localizationConfig.json');

const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig:{
    apiKey: process.env.UNIFORM_API_KEY,
    apiHost: process.env.UNIFORM_CLI_BASE_URL || "https://uniform.app",
    projectId: process.env.UNIFORM_PROJECT_ID,
    sitecoreApiKey: process.env.SITECORE_API_KEY,
    sitecoreSiteName:process.env.SITECORE_SITENAME,
    sitecoreApiUrl: process.env.SITECORE_API_URL
  },
  experimental: {
    esmExternals: false,
  },
  i18n:{
    defaultLocale:"en",
    locales: [...new Set(regions.map(region => region.locales).flat())],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*' }, // any image hosts are welcome
      { protocol: 'https', hostname: 'unresolved' }, // For cases where the data obtained are unresolved
    ],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
  },
};

module.exports = nextConfig;
