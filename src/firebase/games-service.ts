import { callFunction } from './functions-client';
import type { OpsProduct } from '../app/product-context';

export type OpsGameCaptain = {
  id: string;
  displayName: string;
  isAi: boolean;
  verified?: boolean;
  color?: 'WHITE' | 'BLACK';
};

export type OpsGameSummary = {
  id: string;
  phase: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
  objective: string;
  rated: boolean;
  maxPip: number;
  maxPlayers: number;
  captainCount: number;
  captains: OpsGameCaptain[];
  charterId: string | null;
  completedRounds: number;
  campaignRounds: number;
  opsTerminated?: boolean;
  allowSpectate?: boolean;
  spectatorCount?: number;
  roomCode?: string;
  name?: string;
  assisted?: boolean;
  winner?: string | null;
};

export async function listActiveGames(
  product: OpsProduct,
  limit = 100
): Promise<{ games: OpsGameSummary[]; scanned?: number }> {
  if (product === 'lattice') {
    return callFunction('listActiveLatticeRooms', { limit });
  }
  return callFunction('listActiveGames', { limit });
}

export async function searchGames(
  product: OpsProduct,
  input: {
    gameId?: string;
    roomCode?: string;
    hostId?: string;
    phase?: string;
    rated?: boolean | null;
    fromIso?: string;
    toIso?: string;
    limit?: number;
  }
): Promise<{ games: OpsGameSummary[]; scanned?: number }> {
  if (product === 'lattice') {
    return callFunction('searchLatticeRooms', input);
  }
  return callFunction('searchGames', input);
}

export async function getOpsGame(
  product: OpsProduct,
  gameId: string
): Promise<{
  game: OpsGameSummary;
  detail: Record<string, unknown>;
}> {
  if (product === 'lattice') {
    return callFunction('getOpsLatticeRoom', { gameId });
  }
  return callFunction('getOpsGame', { gameId });
}

export type OpsHandRow = {
  playerId: string;
  displayName: string;
  tileCount: number;
  tiles: unknown[];
  seated: boolean;
};

export async function getOpsHands(gameId: string): Promise<{
  gameId: string;
  phase: string;
  roundPhase: string | null;
  hands: OpsHandRow[];
}> {
  return callFunction('getOpsHands', { gameId });
}
