import { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,
  env: {
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
  },
};

export default config;
