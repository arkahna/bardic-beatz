import { unstable_vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { remixDevTools } from "remix-development-tools/vite";

export default defineConfig({
    server: {
        hmr: {
            port: 3005,
        },
    },
    plugins: [
        remixDevTools(),
        remix({
            serverModuleFormat: 'cjs',
        }),
        tsconfigPaths(),
    ],
})
