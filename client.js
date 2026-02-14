const React = require("react");
const { hydrateRoot } = require("react-dom/client");
const App = require("./App");

const initialData =
  typeof window !== "undefined" && window.__INITIAL_DATA__ ? window.__INITIAL_DATA__ : [];

hydrateRoot(document.getElementById("root"), <App initialData={initialData} />);

// Optional: allow GC and make it obvious we shouldn't re-use stale data later.
if (typeof window !== "undefined") {
  delete window.__INITIAL_DATA__;
}