# Karmiol Kitchen

A family recipe management app for two people — browse, search, manage, and discover 50+ recipes scaled for two.

## Architecture

- **Frontend**: React 18 with Vite (port 5000 in dev)
- **Backend**: Express.js REST API (port 3001 in dev)
- **Database**: Replit built-in key-value database (`@replit/database` v3)
- **Package manager**: npm

## Project Structure

```
/
├── src/
│   ├── App.jsx        # Main React application (all components, state, data)
│   └── main.jsx       # Vite entry point
├── index.html         # Vite HTML template
├── vite.config.js     # Vite config (proxy /api → localhost:3001)
├── server.js          # Express backend (ESM format)
├── package.json       # Dependencies and scripts
└── replit.md          # This file
```

## Development

The `npm run dev` command runs both frontend and backend concurrently via `concurrently`:
- Vite dev server on port 5000 (proxies `/api` requests to backend)
- Express API server on port 3001

## API Endpoints

- `GET /api/recipes` — list all recipes
- `GET /api/recipes/:id` — single recipe
- `POST /api/recipes` — create custom recipe
- `PUT /api/recipes/:id` — update recipe
- `DELETE /api/recipes/:id` — delete recipe
- `POST /api/seed` — seed built-in recipes (called once on first load)

## Database Notes

Uses `@replit/database` v3. The v3 API returns `{ok, value}` wrappers instead of plain values, so all DB calls go through helper functions (`dbList`, `dbGet`, `dbSet`, `dbDelete`) in server.js.

## Deployment

- Build: `npm run build` (compiles React via Vite → `dist/`)
- Run: `node server.js` (Express serves the built frontend + API on port 5000)
- Target: Autoscale
