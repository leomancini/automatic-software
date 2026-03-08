import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3125;
const DATA_FILE = join(__dirname, "telemetry.json");

app.use(express.json());

async function loadData() {
  try {
    return JSON.parse(await readFile(DATA_FILE, "utf-8"));
  } catch {
    return { totalSessions: 0, interactions: {} };
  }
}

async function saveData(data) {
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Telemetry endpoint
app.post("/api/telemetry", async (req, res) => {
  try {
    const payload = req.body;
    const data = await loadData();
    data.totalSessions += 1;
    data.lastUpdated = new Date().toISOString();

    for (const [feature, count] of Object.entries(payload.interactions || {})) {
      data.interactions[feature] = (data.interactions[feature] || 0) + count;
    }

    await saveData(data);
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "bad request" });
  }
});

// Serve static files from dist
app.use(express.static(join(__dirname, "dist")));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
