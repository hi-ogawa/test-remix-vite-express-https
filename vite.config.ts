import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    https: {
      key: "localhost-key.pem",
      cert: "localhost.pem",
    },
  },
});
