import { defineConfig } from "@junobuild/config";

/** @type {import('@junobuild/config').JunoConfig} */
export default defineConfig({
  satellite: {
    id: "fqotu-wqaaa-aaaal-acp3a-cai",
    source: "dist",
    storage: {
      iframe: "allow-any",
    },
    predeploy: ["npm run build"],
  },
});
