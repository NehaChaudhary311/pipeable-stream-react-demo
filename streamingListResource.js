function makeItems(count = 25) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    label: `Streamed item ${i + 1}`
  }));
}

/**
 * Suspense-compatible data fetcher:
 * - returns data when ready
 * - throws a Promise while loading
 * - throws an Error if the async work fails
 */
function createStreamingListResource({ delayMs = 2000, count = 25 } = {}) {
  let data = null;
  let error = null;
  let promise = null;

  function load() {
    if (promise) return promise;
    promise = new Promise((resolve) => {
      setTimeout(() => resolve(makeItems(count)), delayMs);
    }).then(
      (items) => {
        data = items;
      },
      (err) => {
        error = err;
      }
    );
    return promise;
  }

  return {
    read() {
      if (error) throw error;
      if (data) return data;
      throw load();
    }
  };
}

module.exports = { createStreamingListResource };

