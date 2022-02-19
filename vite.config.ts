import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import ssrgPlugin from "vite-plugin-ssr-ssg";
import windiCSS from "vite-plugin-windicss";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    ssrgPlugin({
      generate: {
        routes: ["users/1"],
      },
    }),
    windiCSS(),
    tsconfigPaths(),
  ],
  //@ts-ignore
  ssr: {
    noExternal: ["preact-iso"],
  },
  optimizeDeps: {
    entries: ["preact/debug", "preact/devtools"],
  },
});
