import { callFunction } from './functions-client';
import type { OpsProduct } from '../app/product-context';

export async function muteUser(params: {
  uid: string;
  reason: string;
  days?: number;
  notes?: string;
  mode?: 'hard' | 'shadow';
}): Promise<{ muted: boolean; uid: string; mode?: string }> {
  return callFunction('muteUser', params);
}

export async function unmuteUser(uid: string): Promise<{ muted: boolean }> {
  return callFunction('unmuteUser', { uid });
}

export async function muteInSector(params: {
  gameId: string;
  uid: string;
  reason: string;
  days?: number;
}): Promise<{ muted: boolean }> {
  return callFunction('muteInSector', params);
}

export async function unmuteInSector(
  gameId: string,
  uid: string
): Promise<{ muted: boolean }> {
  return callFunction('unmuteInSector', { gameId, uid });
}

export async function opsKickCaptain(
  product: OpsProduct,
  params: {
    gameId: string;
    targetUid: string;
    reason?: string;
  }
): Promise<{ mode: string; remaining: number }> {
  if (product === 'lattice') {
    return callFunction('opsKickLatticePlayer', params);
  }
  return callFunction('opsKickCaptain', params);
}

export async function opsTerminateSector(
  product: OpsProduct,
  params: {
    gameId: string;
    reason?: string;
    mode?: 'soft' | 'hard';
  }
): Promise<{ mode: string; deleted?: unknown }> {
  if (product === 'lattice') {
    return callFunction('opsTerminateLatticeRoom', params);
  }
  return callFunction('opsTerminateSector', params);
}

export async function listStaleGames(
  product: OpsProduct,
  params?: {
    olderThanDays?: number;
    limit?: number;
  }
): Promise<{
  cutoff: string;
  games: Array<{
    id: string;
    phase: string;
    hostId: string;
    updatedAt: string;
    opsTerminated: boolean;
    captainCount: number;
  }>;
}> {
  if (product === 'lattice') {
    return callFunction('listStaleLatticeRooms', params ?? {});
  }
  return callFunction('listStaleGames', params ?? {});
}

export async function opsCleanupStaleSector(
  product: OpsProduct,
  gameId: string
): Promise<{ deleted: Record<string, number> }> {
  if (product === 'lattice') {
    return callFunction('opsCleanupStaleLatticeRoom', { gameId });
  }
  return callFunction('opsCleanupStaleSector', { gameId });
}

export async function opsDropSpectators(
  product: OpsProduct,
  gameId: string
): Promise<{ dropped: number }> {
  if (product === 'lattice') {
    return callFunction('opsDropLatticeObservers', { gameId });
  }
  return callFunction('opsDropSpectators', { gameId });
}

export async function setAllowSpectate(
  product: OpsProduct,
  gameId: string,
  allow: boolean
): Promise<{ allowSpectate?: boolean; allow?: boolean }> {
  if (product === 'lattice') {
    return callFunction('opsSetLatticeAllowObservers', { gameId, allow });
  }
  return callFunction('setAllowSpectate', { gameId, allow });
}
