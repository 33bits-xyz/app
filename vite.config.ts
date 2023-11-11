import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import fs from 'fs';
import path from 'path';

// WASM content type plugin
const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm');
        const newPath = req.url.replace('deps', 'dist');
        const targetPath = path.join(__dirname, newPath);
        const wasmContent = fs.readFileSync(targetPath);
        return res.end(wasmContent);
      }
      next();
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const basePlugins = [react()];

  if (command === 'serve') {
    // Add the WASM content type plugin only for the 'serve' command
    basePlugins.push(wasmContentTypePlugin);
  }

  // Copy plugin is added regardless of the command
  basePlugins.push(
    copy({
      targets: [{ src: 'node_modules/**/*.wasm', dest: 'node_modules/.vite/dist' }],
      copySync: true,
      hook: 'buildStart',
    })
  );

  return {
    plugins: basePlugins,
    resolve: {
      alias: {
        buffer: 'buffer',
      },
    },
    // ... you can spread other shared or environment-specific configurations here
  };
});
