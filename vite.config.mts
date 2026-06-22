import { default as react } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

export default () => {
  const env = loadEnv('all', process.cwd());

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/register': {
          target: env.VITE_REGISTER_PROXY_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/register/, ''),
        },
      },
    },
    assetsInclude: ['**/*.png'],
  });
};
