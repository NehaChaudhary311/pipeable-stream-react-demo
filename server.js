// Bootstrap file so Node can run JSX on the server.
// This enables JSX in `server.jsx` and `App.js` without a separate server build step.
require("@babel/register")({
  extensions: [".js", ".jsx"],
  ignore: [/node_modules/]
});

require("./server.jsx");