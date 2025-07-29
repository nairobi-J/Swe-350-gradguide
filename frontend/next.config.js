// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // <-- ENSURE THIS LINE IS PRESENT AND CORRECT

  // Optional: If your frontend makes API calls to a relative /api/ route
  // and you want Next.js to handle proxying them during development
  // (Nginx will handle this in production on the VPS)
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Matches any request to /api/xyz from your frontend
        destination: 'http://localhost:5000/:path*', // Proxies to your backend inside the Docker Compose network (for dev consistency)
      },
    ];
  },
  // ... any other Next.js configurations you have
};

module.exports = nextConfig;