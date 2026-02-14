const express = require("express");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const App = require("./App");

const app = express();
const port = 3000;

app.use(express.static(path.resolve(__dirname, "public")));

function serializeForScriptTag(data) {
  // Basic hardening so JSON can't accidentally break out of the <script> tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

async function fetchProducts() {
  const url = "https://jsonplaceholder.typicode.com/posts?_limit=10";
  const raw = await fetch(url).then((r) => r.json());

  return raw.map((p) => ({
    id: p.id,
    name: p.title,
    description: p.body,
  }));
}

app.get("/", async (req, res) => {
  try {
    const products = await fetchProducts();

    // appString (HTML): for humans + crawlers on first load.
    const appString = ReactDOMServer.renderToString(
      <App initialData={products} />
    );

    res.send(`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SSR Products</title>
    <meta
      name="description"
      content="Server-rendered product list with hydration (SEO-friendly)."
    />
  </head>
  <body>
    <div id="root">${appString}</div>
    <!-- __INITIAL_DATA__ (JSON): for React on the client to rebuild the same component tree during hydration. -->
    <script>window.__INITIAL_DATA__ = ${serializeForScriptTag(products)};</script>
    <script src="/bundle.js" defer></script>
  </body>
</html>`);
  } catch (e) {
    console.error(e);
    res.status(500).send("Server error");
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
