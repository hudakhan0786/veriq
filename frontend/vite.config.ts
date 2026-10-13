import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables from both frontend and project root directories
  const env = {
    ...process.env,
    ...loadEnv(mode, path.resolve(__dirname, '..'), ''),
    ...loadEnv(mode, path.resolve(__dirname), ''),
  };

  const isHttps = env.HTTPS === 'true' || process.argv.includes('--https');
  const cdnUrl = env.CDN_URL || '/';

  // In LIVE operating mode, default dev proxy routes to live Oracle Cloud VPS backend
  // In LOCAL or MOCK modes, routes to local Python FastAPI server on 127.0.0.1:8000
  const oracleHost = env.ORACLE_VM_HOST || '68.233.117.16';
  const liveTarget = `http://${oracleHost}:8000`;
  const defaultTarget = env.VITE_OPERATING_MODE === 'LIVE' ? liveTarget : 'http://127.0.0.1:8000';
  const proxyTarget =
    env.VITE_PROXY_TARGET ||
    env.BACKEND_PROXY_TARGET ||
    env.VITE_BACKEND_URL ||
    defaultTarget;

  return {
    root: path.resolve(__dirname),
    base: cdnUrl,
    plugins: [
      react(),
      ...(isHttps ? [basicSsl()] : []),
    ],
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-motion';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-common';
            }
          },
        },
      },
    },
  };
});
