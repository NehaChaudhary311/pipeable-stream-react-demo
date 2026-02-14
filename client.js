const React = require("react");
const { hydrateRoot } = require("react-dom/client");
const App = require("./App");
const { createStreamingListResource } = require("./streamingListResource");

// IMPORTANT: This resource suspends on the client too.
// During hydration, React can hydrate the Counter (shell) while keeping the list
// boundary "dehydrated" until this resolves (Selective Hydration).
const streamStart =
  typeof window !== "undefined" && typeof window.__STREAM_START__ === "number"
    ? window.__STREAM_START__
    : Date.now();
const elapsed = Date.now() - streamStart;
const remaining = Math.max(0, 2000 - elapsed);

const resource = createStreamingListResource({ delayMs: remaining, count: 25 });

hydrateRoot(document.getElementById("root"), <App resource={resource} />, {
  onRecoverableError(err) {
    // This can happen if a Suspense boundary resolves while hydration is still in progress.
    // We align the client delay with the server start above, so it should be rare.
    if (
      err &&
      typeof err.message === "string" &&
      err.message.includes("received an update before it finished hydrating")
    ) {
      return;
    }
    // Keep other recoverable errors visible.
    // eslint-disable-next-line no-console
    console.error(err);
  }
});