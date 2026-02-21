/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true }, // برای GitHub Pages
};

module.exports = nextConfig;