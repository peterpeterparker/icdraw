import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import juno from "@junobuild/vite-plugin";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), juno({ container: true })],
  worker: {
    format: "es",
  },
});
