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

const viteDevServer = await createServer({
  server: { middlewareMode: true, hmr: { server } },
});

app.use(viteDevServer.middlewares);

app.all(
  "*",
  createRequestHandler({
    build: () => viteDevServer.ssrLoadModule(unstable_viteServerBuildModuleId),
  })
);

const port = 3000;
server.listen(port, () => console.log("https://localhost:" + port));
