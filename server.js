const express = require("express");
const path = require("path");
const React = require("react");
const { PassThrough } = require("stream");
const { renderToPipeableStream } = require("react-dom/server");

const App = require("./App");
const { createStreamingListResource } = require("./streamingListResource");

const app = express();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";

const ABORT_DELAY_MS = 10_000;

app.use(express.static(path.resolve(__dirname, "public")));

app.get("/", (req, res) => {
  let didError = false;
  const streamStart = Date.now();

  // "Suspense-compatible" fetcher: resolves after 2s and causes StreamingList to suspend.
  const resource = createStreamingListResource({ delayMs: 2000, count: 25 });

  const element = <App resource={resource} />;

  const { pipe, abort } = renderToPipeableStream(element, {
    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");

      // Send the HTML shell immediately (TTFB win).
      res.write(`<!doctype html>
            <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Streaming SSR + Selective Hydration</title>
                <script>window.__STREAM_START__ = ${streamStart};</script>
                <script src="/bundle.js" async></script>
            </head>
            <body style="margin:0">
                <div id="root">`
            );

      // Pipe React's stream directly into the response.
      const body = new PassThrough();
      body.pipe(res, { end: false });
      body.on("end", () => {
        res.end(`</div></body></html>`);
      });

      pipe(body);
    },
    onShellError(err) {
      console.error("onShellError:", err);
      res.statusCode = 500;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.end("Failed to render.");
    },
    onError(err) {
      didError = true;
      console.error("onError:", err);
    }
  });

  setTimeout(() => abort(), ABORT_DELAY_MS);
});

app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});