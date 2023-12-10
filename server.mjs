import { unstable_viteServerBuildModuleId } from "@remix-run/dev";
import { createRequestHandler } from "@remix-run/express";
import express from "express";
import https from "node:https";
import fs from "node:fs";
import { createServer } from "vite";

const app = express();

const server = https.createServer(
  {
    key: fs.readFileSync("localhost-key.pem"),
    cert: fs.readFileSync("localhost.pem"),
  },
  app
);

let remixBuild;

if (process.env.NODE_ENV === "production") {
  // static assets
  app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" })
  );
  app.use(express.static("build/client", { maxAge: "1h" }));

  // remix server build
  remixBuild = await import("./build/server/index.js");

} else {
  // vite middleware
  const viteDevServer = await createServer({
    server: { middlewareMode: true, hmr: { server } },
  });
  app.use(viteDevServer.middlewares);

  // remix server build
  remixBuild = () =>
    viteDevServer.ssrLoadModule(unstable_viteServerBuildModuleId);
}

app.all(
  "*",
  createRequestHandler({
    build: remixBuild,
  })
);

const port = 3000;
server.listen(port, () => console.log("https://localhost:" + port));
