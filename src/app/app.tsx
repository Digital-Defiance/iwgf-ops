import { useEffect, useState } from 'react';

import { AuditPanel } from './audit-panel';
import { BansPanel } from './bans-panel';
import { CaptainsPanel } from './captains-panel';
import { CrewsPanel } from './crews-panel';
import { OpsProductProvider, useOpsProduct } from './product-context';
import { ReportsPanel } from './reports-panel';
import { SectorsPanel } from './sectors-panel';
import { SubspacePanel } from './subspace-panel';
import { TtsCachePanel } from './tts-cache-panel';
import { useOpsAuth } from '../firebase/ops-auth';

type OpsTab =
  | 'sectors'
  | 'captains'
  | 'subspace'
  | 'reports'
  | 'crews'
  | 'audit'
  | 'bans'
  | 'tts-cache';

function OpsShell() {
  const auth = useOpsAuth();
  const { product, setProduct, labels, isWarpOnlyTab } = useOpsProduct();
  const [tab, setTab] = useState<OpsTab>('sectors');

  useEffect(() => {
    if (isWarpOnlyTab(tab)) {
      setTab('sectors');
    }
  }, [product, tab, isWarpOnlyTab]);

  if (!auth.ready) {
    return (
      <div className="shell">
        <main className="main">
          <p role="status">Loading IWGF Ops…</p>
        </main>
      </div>
    );
  }

  if (!auth.configured) {
    return (
      <div className="shell">
        <main className="main">
          <div className="gate panel">
            <h2>Firebase not configured</h2>
            <p>
              Set <code>VITE_FIREBASE_*</code> in <code>.env</code> at the ops
              package root (see <code>.env.example</code>).
            </p>
          </div>
        </main>
      </div>
    );
  }

  const roleLabel = auth.isAdmin
    ? 'admin'
    : auth.roles.includes('moderator')
      ? 'moderator'
      : 'ops';

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <img
            src="/iwgf-1-1-ops-tx.svg"
            alt=""
            width={40}
            height={40}
          />
          <div>
            <h1>IWGF Ops</h1>
            <p>Federation administration · warp-12</p>
          </div>
        </div>
        <div className="session">
          <div
            className="product-toggle"
            role="group"
            aria-label="Product"
          >
            <button
              type="button"
              className={product === 'warp' ? 'btn primary' : 'btn'}
              aria-pressed={product === 'warp'}
              onClick={() => setProduct('warp')}
            >
              Warp
            </button>
            <button
              type="button"
              className={product === 'lattice' ? 'btn primary' : 'btn'}
              aria-pressed={product === 'lattice'}
              onClick={() => setProduct('lattice')}
            >
              Lattice
            </button>
          </div>
          {auth.user && !auth.user.isAnonymous ? (
            <>
              <code>{auth.user.email ?? auth.user.uid}</code>
              {auth.isOps ? (
                <span className="badge" title="Auth custom claim">
                  {roleLabel}
                </span>
              ) : null}
              <button type="button" className="btn" onClick={() => void auth.signOut()}>
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn primary"
              onClick={() => void auth.signIn()}
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      <main className="main">
        {!auth.user || auth.user.isAnonymous ? (
          <div className="gate panel">
            <h2>Sign in required</h2>
            <p>
              IWGF Ops is restricted to captains with the Firebase{' '}
              <strong>admin</strong> or <strong>moderator</strong> claim.
            </p>
            {auth.error ? (
              <div className="msg error" role="alert">
                {auth.error}
              </div>
            ) : null}
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn primary"
                onClick={() => void auth.signIn()}
              >
                Sign in with Google
              </button>
            </div>
          </div>
        ) : auth.checkingAdmin ? (
          <p role="status">Checking ops claim…</p>
        ) : !auth.isOps ? (
          <div className="gate panel">
            <h2>Ops role required</h2>
            <p>
              Signed in as {auth.user.email ?? auth.user.uid}, but this account
              does not have the <code>admin</code> or <code>moderator</code>{' '}
              role.
            </p>
            <div className="actions" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn"
                onClick={() => void auth.refreshAdmin()}
              >
                Refresh claim
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => void auth.signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="product-context" role="status">
              Moderating <strong>{labels.productName}</strong>
              {product === 'lattice'
                ? ' — Crews, Reports, and TTS stay on Warp.'
                : null}
            </p>
            <nav className="nav" aria-label="Ops sections">
              <button
                type="button"
                className="btn"
                aria-current={tab === 'sectors' ? 'page' : undefined}
                onClick={() => setTab('sectors')}
              >
                {labels.matches}
              </button>
              <button
                type="button"
                className="btn"
                aria-current={tab === 'captains' ? 'page' : undefined}
                onClick={() => setTab('captains')}
              >
                Captains
              </button>
              <button
                type="button"
                className="btn"
                aria-current={tab === 'subspace' ? 'page' : undefined}
                onClick={() => setTab('subspace')}
              >
                {labels.chat}
              </button>
              {product === 'warp' ? (
                <button
                  type="button"
                  className="btn"
                  aria-current={tab === 'reports' ? 'page' : undefined}
                  onClick={() => setTab('reports')}
                >
                  Reports
                </button>
              ) : null}
              {product === 'warp' ? (
                <button
                  type="button"
                  className="btn"
                  aria-current={tab === 'crews' ? 'page' : undefined}
                  onClick={() => setTab('crews')}
                >
                  Crews
                </button>
              ) : null}
              <button
                type="button"
                className="btn"
                aria-current={tab === 'audit' ? 'page' : undefined}
                onClick={() => setTab('audit')}
              >
                Audit
              </button>
              {auth.isAdmin ? (
                <button
                  type="button"
                  className="btn"
                  aria-current={tab === 'bans' ? 'page' : undefined}
                  onClick={() => setTab('bans')}
                >
                  Bans
                </button>
              ) : null}
              {auth.isAdmin && product === 'warp' ? (
                <button
                  type="button"
                  className="btn"
                  aria-current={tab === 'tts-cache' ? 'page' : undefined}
                  onClick={() => setTab('tts-cache')}
                >
                  TTS cache
                </button>
              ) : null}
            </nav>
            {tab === 'sectors' ? (
              <SectorsPanel />
            ) : tab === 'captains' ? (
              <CaptainsPanel />
            ) : tab === 'subspace' ? (
              <SubspacePanel />
            ) : tab === 'reports' && product === 'warp' ? (
              <ReportsPanel />
            ) : tab === 'crews' && product === 'warp' ? (
              <CrewsPanel />
            ) : tab === 'audit' ? (
              <AuditPanel />
            ) : tab === 'bans' && auth.isAdmin ? (
              <BansPanel />
            ) : tab === 'tts-cache' && auth.isAdmin && product === 'warp' ? (
              <TtsCachePanel />
            ) : (
              <SectorsPanel />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <OpsProductProvider>
      <OpsShell />
    </OpsProductProvider>
  );
}
