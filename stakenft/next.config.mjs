/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    STAKE_ADDRESS: process.env.STAKE_ADDRESS,
    COLLECTION_ADDRESS: process.env.COLLECTION_ADDRESS,
    CHAIN_ID: process.env.CHAIN_ID,
  },
};

export default nextConfig;
