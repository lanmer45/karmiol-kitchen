// server.js — Karmiol Kitchen backend
import express from "express";
import cors from "cors";
import Database from "@replit/database";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import OpenAI from "openai";

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

// ── Import recipe from URL ────────────────────────────────────────────────────
app.post("/api/import/url", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });
  try {
    const fetch = (await import("node-fetch")).default;
    const html = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10000 })
      .then(r => r.text());
    const stripped = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Extract a recipe from the provided text and return ONLY valid JSON matching this schema exactly:
{"name":"string","category":"Fish & Seafood|Poultry|Meat|Vegetables & Sides|Soups|Eggs & Cheese|Other Favorites","cookTime":number,"calories":number,"fat":number,"protein":number,"carbs":number,"serves":"string","planAhead":boolean,"perishable":["array of perishable ingredient names without quantities"],"ingredients":["array of ingredient strings WITH quantities, e.g. '2 tbsp butter' or '1 lb chicken breast'"],"directions":["array of step strings"],"note":"string","image":""}
If nutrition is not available, estimate reasonably. Return only the JSON object, no markdown.` },
        { role: "user", content: stripped }
      ],
      temperature: 0.2,
    });
    const raw = completion.choices[0].message.content.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const recipe = JSON.parse(raw);
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Import recipe from photo (base64) ─────────────────────────────────────────
app.post("/api/import/photo", express.json({ limit: "10mb" }), async (req, res) => {
  const { image } = req.body;
  if (!image) return res.status(400).json({ error: "image required" });
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: `Extract the recipe shown in this image and return ONLY valid JSON matching this schema exactly:
{"name":"string","category":"Fish & Seafood|Poultry|Meat|Vegetables & Sides|Soups|Eggs & Cheese|Other Favorites","cookTime":number,"calories":number,"fat":number,"protein":number,"carbs":number,"serves":"string","planAhead":boolean,"perishable":["array of perishable ingredient names without quantities"],"ingredients":["array of ingredient strings WITH quantities, e.g. '2 tbsp butter' or '1 lb chicken breast'"],"directions":["array of step strings"],"note":"string","image":""}
If nutrition is not visible, estimate reasonably. Return only the JSON object, no markdown.` },
        { role: "user", content: [{ type: "image_url", image_url: { url: image } }] }
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });
    const raw = completion.choices[0].message.content.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    const recipe = JSON.parse(raw);
    res.json(recipe);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── AI Grocery List with quantities ─────────────────────────────────────────
app.post("/api/grocery-list", async (req, res) => {
  try {
    const { recipes } = req.body;
    const { OpenAI } = await import("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const recipeList = recipes.map(r =>
      `${r.name} (serves ${r.serves||2}): ${(r.ingredients||[]).join(", ")}`
    ).join("\n");
    const prompt = `You are a meal prep assistant for a household of 2. Given these recipes planned for this week, produce a consolidated grocery list with realistic quantities.

Recipes:
${recipeList}

Rules:
- Each recipe serves 2 people
- Combine quantities when the same ingredient appears in multiple recipes (e.g. if two recipes each need butter, total it)
- Use practical grocery quantities: lbs, oz, bunches, cans, cups, tbsp, tsp, heads, cloves, etc.
- Pantry staples that most people have (salt, pepper, basic flour, sugar) can be omitted unless a large amount is needed
- Format each item as: "ingredient — quantity"

Return a JSON object with exactly these keys: produce, meat, dairy, pantry
Each value is an array of strings.`;
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });
    res.json(JSON.parse(resp.choices[0].message.content));
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
