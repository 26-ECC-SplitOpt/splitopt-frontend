import { defineConfig, loadEnv } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
    server: {
      // 프론트는 항상 상대경로(/api/...)로만 요청한다. MSW mock 핸들러가
      // 있으면 그게 먼저 가로채고, 없는 요청만 이 프록시를 통해 실제
      // 백엔드(VITE_API_BASE_URL)로 그대로 전달된다.
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
