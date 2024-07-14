// vite.config.js
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { material } from '@mui/material';

export default defineConfig({
  plugins: [
    reactRefresh(),
    material(),
  ],
});
