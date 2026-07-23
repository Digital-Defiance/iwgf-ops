import { callFunction } from './functions-client';
import type { OpsProduct } from '../app/product-context';

export type OpsMessageHit = {
  gameId: string;
  messageId: string;
  from: string;
  fromName: string;
  kind: string;
  text: string | null;
  phraseId: string | null;
  to: string | null;
  channel: string;
  at: string;
};

export type SearchMessagesParams = {
  text?: string;
  fromUid?: string;
  fromName?: string;
  gameId?: string;
  fromIso?: string;
  toIso?: string;
  limit?: number;
};

function mapLatticeMessage(m: {
  id: string;
  gameId: string;
  senderId: string;
  text: string;
  createdAt: string;
  isSystemMessage?: boolean;
}): OpsMessageHit {
  return {
    gameId: m.gameId,
    messageId: m.id,
    from: m.senderId,
    fromName: m.senderId === 'SYSTEM' ? 'SYSTEM' : m.senderId,
    kind: m.isSystemMessage ? 'system' : 'text',
    text: m.text,
    phraseId: null,
    to: null,
    channel: 'room',
    at: m.createdAt,
  };
}

export async function searchMessages(
  product: OpsProduct,
  params: SearchMessagesParams
): Promise<{
  hits: OpsMessageHit[];
  scanned: number;
  window: { fromIso: string | null; toIso: string };
  note: string | null;
}> {
  if (product === 'lattice') {
    const result = await callFunction<
      { query?: string; senderId?: string; gameId?: string; limit?: number },
      { messages: Array<Parameters<typeof mapLatticeMessage>[0]> }
    >('searchLatticeChat', {
      query: params.text,
      senderId: params.fromUid,
      gameId: params.gameId,
      limit: params.limit,
    });
    return {
      hits: (result.messages ?? []).map(mapLatticeMessage),
      scanned: result.messages?.length ?? 0,
      window: { fromIso: null, toIso: new Date().toISOString() },
      note: null,
    };
  }
  return callFunction('searchMessages', params);
}

export async function listSectorMessages(
  product: OpsProduct,
  gameId: string,
  limit = 200
): Promise<{ messages: OpsMessageHit[]; gameId: string }> {
  if (product === 'lattice') {
    const result = await callFunction<
      { gameId: string; limit: number },
      { messages: Array<Parameters<typeof mapLatticeMessage>[0]> }
    >('listLatticeRoomChat', { gameId, limit });
    return {
      gameId,
      messages: (result.messages ?? []).map(mapLatticeMessage),
    };
  }
  return callFunction('listSectorMessages', { gameId, limit });
}

export async function deleteSectorMessage(
  product: OpsProduct,
  gameId: string,
  messageId: string,
  reason?: string
): Promise<{ deleted?: boolean; ok?: boolean }> {
  if (product === 'lattice') {
    return callFunction('deleteLatticeChatMessage', { gameId, messageId });
  }
  return callFunction('deleteSectorMessage', { gameId, messageId, reason });
}

export async function redactSectorMessage(
  gameId: string,
  messageId: string,
  reason?: string
): Promise<{ redacted: boolean }> {
  return callFunction('redactSectorMessage', { gameId, messageId, reason });
}
