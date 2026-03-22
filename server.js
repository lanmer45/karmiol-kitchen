// server.js — Karmiol Kitchen backend
// Runs on Replit, uses built-in Replit DB for persistence
// Install deps: npm install express cors @replit/database

const express = require("express");
const cors = require("cors");
const Database = require("@replit/database");

const app = express();
const db = new Database();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// ── GET all recipes ──────────────────────────────────────────────────────────
app.get("/api/recipes", async (req, res) => {
  try {
    const keys = await db.list("recipe_");
    const recipes = await Promise.all(keys.map(k => db.get(k)));
    res.json(recipes.filter(Boolean).sort((a, b) => a.name.localeCompare(b.name)));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── GET single recipe ────────────────────────────────────────────────────────
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const recipe = await db.get(`recipe_${req.params.id}`);
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
    await db.set(`recipe_${recipe.id}`, recipe);
    res.status(201).json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── PUT update recipe ────────────────────────────────────────────────────────
app.put("/api/recipes/:id", async (req, res) => {
  try {
    const existing = await db.get(`recipe_${req.params.id}`);
    if (!existing) return res.status(404).json({ error: "Not found" });
    const updated = { ...existing, ...req.body, id: req.params.id };
    await db.set(`recipe_${req.params.id}`, updated);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── DELETE recipe ────────────────────────────────────────────────────────────
app.delete("/api/recipes/:id", async (req, res) => {
  try {
    await db.delete(`recipe_${req.params.id}`);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Seed built-in recipes (run once) ────────────────────────────────────────
app.post("/api/seed", async (req, res) => {
  try {
    const { recipes } = req.body;
    await Promise.all(recipes.map(r => db.set(`recipe_${r.id}`, r)));
    res.json({ seeded: recipes.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`Karmiol Kitchen API running on port ${PORT}`));
