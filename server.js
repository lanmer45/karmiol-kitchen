// server.js — Karmiol Kitchen backend
import express from "express";
import cors from "cors";
import Database from "@replit/database";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

async function dbList(prefix) {
  const result = await db.list(prefix);
  return result && result.value ? result.value : (Array.isArray(result) ? result : []);
}

async function dbGet(key) {
  const result = await db.get(key);
  return result && result.value !== undefined ? result.value : result;
}

async function dbSet(key, value) {
  return db.set(key, value);
}

async function dbDelete(key) {
  return db.delete(key);
}

// ── GET all recipes ──────────────────────────────────────────────────────────
app.get("/api/recipes", async (req, res) => {
  try {
    const keys = await dbList("recipe_");
    const recipes = await Promise.all(keys.map(k => dbGet(k)));
    res.json(recipes.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET single recipe ────────────────────────────────────────────────────────
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await dbGet(`recipe_${req.params.id}`);
    if (!recipe) return res.status(404).json({ error: "Not found" });
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST new recipe ──────────────────────────────────────────────────────────
app.post("/api/recipes", async (req, res) => {
  try {
    const recipe = {
      ...req.body,
      id: `custom_${Date.now()}`,
      createdAt: new Date().toISOString(),
      isCustom: true,
    };
    await dbSet(`recipe_${recipe.id}`, recipe);
    res.status(201).json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT update recipe ────────────────────────────────────────────────────────
app.put("/api/recipes/:id", async (req, res) => {
  try {
    const existing = await dbGet(`recipe_${req.params.id}`);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = { ...existing, ...req.body, id: req.params.id };
    await dbSet(`recipe_${req.params.id}`, updated);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── DELETE recipe ────────────────────────────────────────────────────────────
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    await dbDelete(`recipe_${req.params.id}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Seed built-in recipes (run once) ────────────────────────────────────────
app.post("/api/seed", async (req, res) => {
  try {
    const { recipes } = req.body;
    await Promise.all(recipes.map(r => dbSet(`recipe_${r.id}`, r)));
    res.json({ seeded: recipes.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Serve built frontend in production ───────────────────────────────────────
const distPath = join(__dirname, "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(join(distPath, "index.html"));
  });
}

const host = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
app.listen(PORT, host, () => console.log(`Karmiol Kitchen API running on port ${PORT}`));
