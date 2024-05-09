import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import juno from "@junobuild/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), juno()],
  worker: {
    format: "es",
  }
});
