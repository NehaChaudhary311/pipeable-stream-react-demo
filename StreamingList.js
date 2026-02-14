const React = require("react");

function StreamingList({ resource }) {
  const items = resource.read(); // may throw Promise -> Suspense

  return (
    <section style={styles.card}>
      <h2 style={styles.h2}>Heavy component (appears ~2s later)</h2>
      <ul style={styles.ul}>
        {items.map((it) => (
          <li key={it.id}>{it.label}</li>
        ))}
      </ul>
    </section>
  );
}

const styles = {
  card: { border: "1px solid #ddd", borderRadius: 10, padding: 12, marginTop: 12 },
  h2: { margin: "0 0 8px 0" },
  ul: { margin: 0, paddingLeft: 18 }
};

module.exports = StreamingList;

