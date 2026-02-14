const React = require("react");
const StreamingList = require("./StreamingList");

function Navbar() {
  return (
    <header style={styles.navbar}>
      <strong>Streaming SSR Demo</strong>
      <span style={styles.navHint}>Navbar streams in the shell</span>
    </header>
  );
}

function Loading() {
  return <section style={styles.loading}>Loading…</section>;
}

function App({ resource } = {}) {
  const [count, setCount] = React.useState(0);

  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        <h1 style={styles.h1}>Selective Hydration</h1>
        <p style={styles.p}>
          You should be able to click the counter immediately, even while the list is still loading.
        </p>
        <button onClick={() => setCount((c) => c + 1)}>Counter: {count}</button>

        <React.Suspense fallback={<Loading />}>
          <StreamingList resource={resource} />
        </React.Suspense>
      </main>
    </div>
  );
}

const styles = {
  page: { fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    background: "white"
  },
  navHint: { color: "#666" },
  main: { padding: 16 },
  h1: { marginTop: 0 },
  p: { margin: "8px 0 12px 0", color: "#444" },
  loading: {
    border: "1px dashed #bbb",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    background: "#fafafa"
  }
};

module.exports = App;