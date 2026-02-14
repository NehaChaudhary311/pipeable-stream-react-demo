# React 18 Streaming SSR + Suspense + Selective Hydration (Express + webpack)

This repo is a **manual React 18 streaming SSR** demo using `renderToPipeableStream`.

The goal on refresh:
- **See the shell immediately** (Navbar + Counter)
- Be able to **click Counter immediately**
- See the **StreamingList appear ~2 seconds later** (simulated slow “API”)
- No full page refresh required

---

## How to run

Install deps:

```bash
npm install
```

Build the client bundle (webpack outputs `public/bundle.js`):

```bash
npm run build:dev
```

Start the server:

```bash
npm start
```

Open: `http://127.0.0.1:3000`

---

## What's in here

### Streaming SSR (faster TTFB)
The server uses `renderToPipeableStream` and starts sending HTML as soon as React can render the “shell”.

- The **shell** is: Navbar + Counter + the Suspense fallback (Loading…).
- The **heavy part** is: `StreamingList`, which intentionally suspends for ~2 seconds.

### Selective Hydration (interactivity comes in pieces)
SSR gives you HTML quickly, but **event handlers are not “in HTML”**.

Hydration is the step where the browser runs the React code and attaches events.

With React 18 + Suspense, hydration can be **selective**:
- The **Counter button** (outside `<Suspense>`) can hydrate first and become clickable immediately
- The **StreamingList boundary** can hydrate later, when its promise resolves

---

## “If `<Navbar />` is in `App.js`, isn’t it client-side?”

In this project, **`App.js` is not “client-only”**.

The same React component tree is used in two places:

- **On the server (Node)** to generate HTML (SSR)
- **In the browser** to attach events and handle updates (hydration)

So `<Navbar />` is in `App.js`, and:
- It **is rendered on the server** as HTML (because the server renders `<App />`)
- It is also **run in the browser** during hydration (same code, different runtime)

What’s *client-only* is **interactivity** (e.g., `onClick`), not the markup.

---

## Key files

- **`server.js`**
  - Express server
  - Uses `renderToPipeableStream`
  - Writes the document shell immediately in `onShellReady`, then streams the React HTML
  - Injects `window.__STREAM_START__` so the client can align its 2s timer with the server

- **`App.js`**
  - Navbar + Counter (shell)
  - Wraps `StreamingList` in `<React.Suspense fallback={<Loading />}>`

- **`StreamingList.js`**
  - Calls `resource.read()`
  - If data isn’t ready, `read()` throws a Promise → React suspends → fallback shows

- **`streamingListResource.js`**
  - The “Suspense-compatible fetcher”:
    - returns data when ready
    - throws a Promise while loading
    - throws an Error if it fails

- **`client.js`**
  - Calls `hydrateRoot(...)`
  - Creates a client resource whose delay is aligned to `window.__STREAM_START__`

---

## How to *prove* it’s streaming

In another terminal:

```bash
curl -N http://127.0.0.1:3000/
```

You should see HTML start printing immediately, then more content later.

---

## Screen recording

Screen recording of the demo:

- [`ssr-streaming.mov`](./ssr-streaming.mov)

I can’t generate a video file from inside this coding session, but you can add one to the repo:

1) Record your screen (macOS: QuickTime → “New Screen Recording”)
2) Save it as: `docs/streaming-ssr-demo.mp4`
3) Commit it (or, if it’s large, use Git LFS / GitHub Release)

After you add it, link it here:
- `docs/streaming-ssr-demo.mp4`

There’s a short checklist in `docs/screen-recording.md`.

