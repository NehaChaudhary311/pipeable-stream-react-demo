module.exports = function babelConfig(api) {
  // `BABEL_ENV=server` is used for the Express/Node runtime.
  // `BABEL_ENV=client` (or default) is used for the webpack bundle.
  const env = api.env() || "client";
  api.cache(true);

  const isServer = env === "server";

  return {
    presets: [
      [
        "@babel/preset-react",
        // Use classic runtime everywhere to avoid injecting ESM imports like
        // `import { jsx } from "react/jsx-runtime"`, which can conflict with
        // CommonJS `module.exports` in this repo's files.
        { runtime: "classic" }
      ]
    ]
  };
};

