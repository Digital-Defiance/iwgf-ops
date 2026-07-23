# IWGF Ops

Federation administration console for **Warp Dominoes** and **Subspace Lattice** (Firebase project `warp-12`).

Lives at the IWGF workspace root as `ops/` → https://ops.iwgf.org

## Product toggle

Header **Warp | Lattice** scopes every shared panel:

| Tab | Warp | Lattice |
|-----|------|---------|
| Sectors / Rooms | `games` | `latticeRooms` |
| Captains | shared identity + Warp TEI | shared identity + `latticeTei` ledger |
| Subspace / Chat | sector messages | room chat |
| Bans / Audit | federation-wide | federation-wide (`detail.product: lattice` on Lattice actions) |
| Reports / Crews / TTS | Warp only | hidden |

## Surfaces

| Surface | Command | URL / artifact |
|---------|---------|----------------|
| Web (dev) | `yarn dev` | http://localhost:4220 |
| Web (prod) | `yarn deploy:hosting` | https://ops.iwgf.org |
| Desktop | `yarn tauri:dev` / `yarn tauri:build` | Warp Ops.app |

Copy `VITE_FIREBASE_*` (and desktop Google OAuth keys if using Tauri) into `.env` — see `.env.example`.

## Backend

- Warp + Lattice **ops** callables live in `Warp12/functions` (same `/api/fn` proxy).
- Lattice **player** callables stay in `subspace-lattice/apps/functions`.
- Deploy staging: `dist/` → `Warp12/federation-hosting/ops`.
