const TELEMETRY_ENDPOINT = "/api/telemetry";
const FLUSH_INTERVAL = 30_000; // send every 30s

const counts = {};
let sessionStart = Date.now();

export function trackInteraction(feature) {
  counts[feature] = (counts[feature] || 0) + 1;
}

function flush() {
  if (Object.keys(counts).length === 0) return;
  // Only send non-zero counts
  const interactions = {};
  for (const [k, v] of Object.entries(counts)) {
    if (v > 0) interactions[k] = v;
  }
  if (Object.keys(interactions).length === 0) return;

  const payload = {
    timestamp: Date.now(),
    sessionDuration: Date.now() - sessionStart,
    interactions,
  };
  // Reset counts after flush
  for (const key in counts) counts[key] = 0;

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    navigator.sendBeacon(TELEMETRY_ENDPOINT, blob);
  } catch {
    // silently ignore
  }
}

// Auto-track button clicks by their title attribute
document.addEventListener("click", (e) => {
  const button = e.target.closest("button[title]");
  if (button) {
    trackInteraction("button:" + button.title);
  }
});

// Auto-track canvas interactions
document.addEventListener("pointerdown", (e) => {
  if (e.target.tagName === "CANVAS") {
    trackInteraction("canvas:tap");
  }
});

document.addEventListener("dblclick", (e) => {
  if (e.target.tagName === "CANVAS") {
    trackInteraction("canvas:double_click");
  }
});

document.addEventListener("contextmenu", (e) => {
  if (e.target.tagName === "CANVAS") {
    trackInteraction("canvas:right_click");
  }
});

// Track keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.target !== document.body) return;
  trackInteraction("key:" + e.key);
});

// Flush periodically
setInterval(flush, FLUSH_INTERVAL);

// Flush on page unload
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flush();
});
