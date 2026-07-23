import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type OpsProduct = 'warp' | 'lattice';

const STORAGE_KEY = 'iwgf.ops.product';

type OpsProductContextValue = {
  product: OpsProduct;
  setProduct: (next: OpsProduct) => void;
  /** Warp-only chrome (Crews, Reports, TTS). */
  isWarpOnlyTab: (tab: string) => boolean;
  labels: {
    productName: string;
    match: string;
    matches: string;
    matchId: string;
    seats: string;
    chat: string;
  };
};

const WARP_ONLY_TABS = new Set(['reports', 'crews', 'tts-cache']);

const OpsProductContext = createContext<OpsProductContextValue | null>(null);

function readStoredProduct(): OpsProduct {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === 'lattice' || raw === 'warp') {
      return raw;
    }
  } catch {
    /* ignore */
  }
  return 'warp';
}

export function OpsProductProvider({ children }: { children: ReactNode }) {
  const [product, setProductState] = useState<OpsProduct>(() =>
    typeof window === 'undefined' ? 'warp' : readStoredProduct()
  );

  const setProduct = useCallback((next: OpsProduct) => {
    setProductState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<OpsProductContextValue>(() => {
    const labels =
      product === 'lattice'
        ? {
            productName: 'Subspace Lattice',
            match: 'Room',
            matches: 'Rooms',
            matchId: 'Room id',
            seats: 'Seats',
            chat: 'Chat',
          }
        : {
            productName: 'Warp Dominoes',
            match: 'Sector',
            matches: 'Sectors',
            matchId: 'Sector id',
            seats: 'Fleet',
            chat: 'Subspace',
          };
    return {
      product,
      setProduct,
      isWarpOnlyTab: (tab) => product === 'lattice' && WARP_ONLY_TABS.has(tab),
      labels,
    };
  }, [product, setProduct]);

  return (
    <OpsProductContext.Provider value={value}>
      {children}
    </OpsProductContext.Provider>
  );
}

export function useOpsProduct(): OpsProductContextValue {
  const ctx = useContext(OpsProductContext);
  if (!ctx) {
    throw new Error('useOpsProduct requires OpsProductProvider');
  }
  return ctx;
}
