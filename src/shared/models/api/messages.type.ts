export type WsFile = {
  id: number;
  user_id: number;
  path: string;
  filename: string;
  content_type: string;
  content_size: number;
  upload_date: string;
};

export type WsMessageType = 'message' | 'file' | 'sticker';

export type WsChatMessage = {
  id: number | string;
  chat_id?: number | string;
  time: string;
  type: WsMessageType;
  user_id: number | string;
  content: string;
  file?: WsFile | null;
};

export type WsClientMessage =
  | { type: 'ping' }
  | { type: 'get old'; content: string }
  | { type: 'message'; content: string }
  | { type: 'file'; content: string }
  | { type: 'sticker'; content: string };

const WS_MESSAGE_TYPES = new Set<string>(['message', 'file', 'sticker']);

export function isWsChatMessage(value: unknown): value is WsChatMessage {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Partial<WsChatMessage>;

  return (
    typeof candidate.type === 'string' &&
    WS_MESSAGE_TYPES.has(candidate.type) &&
    'content' in candidate &&
    'user_id' in candidate
  );
}
