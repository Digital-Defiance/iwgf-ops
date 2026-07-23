# IWGF Ops

Federation administration console for Warp + Subspace Lattice (Firebase project `warp-12`).

Lives at the IWGF workspace root as `ops/` → https://ops.iwgf.org

## Surfaces

| Surface | Command | URL / artifact |
|---------|---------|----------------|
| Web (dev) | `yarn dev` | http://localhost:4220 |
| Web (prod) | `yarn deploy:hosting` | https://ops.iwgf.org |
| Desktop | `yarn tauri:dev` / `yarn tauri:build` | Warp Ops.app |

Copy `VITE_FIREBASE_*` (and desktop Google OAuth keys if using Tauri) into `.env` — see `.env.example`.

## Access

Google sign-in required. Auth custom claims `admin` / `moderator`. Warp callables still live in `Warp12/functions`; Lattice panels will call `lattice` functions.

## Deploy

Staging copies `dist/` into `Warp12/federation-hosting/ops` (Firebase `public` must stay under the Warp12 firebase.json tree), then deploys hosting target `ops`.
