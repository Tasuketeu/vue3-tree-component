import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	plugins: [vue()],
	build: {
		// Будет падать при ошибках TypeScript
		minify: 'terser',
		sourcemap: false,
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
	},
});
