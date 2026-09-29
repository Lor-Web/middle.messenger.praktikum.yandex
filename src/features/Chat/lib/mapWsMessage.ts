import getResourceUrl from '@/shared/helpers/getResourceUrl';
import type { WsChatMessage } from '@/shared/models/api/messages.type';
import { isWsChatMessage } from '@/shared/models/api/messages.type';
import type { Message } from '@/shared/models/base.type';

function mapFileMessage(message: WsChatMessage, id: number, senderId: number): Message {
  const url = getResourceUrl(message.file?.path);
  const isImage =
    message.type === 'sticker' || Boolean(message.file?.content_type?.startsWith('image/'));

  if (url && isImage) {
    return {
      id,
      senderId,
      timestamp: message.time,
      message: { type: 'image', value: url },
    };
  }

  return {
    id,
    senderId,
    timestamp: message.time,
    message: { type: 'text', value: message.file?.filename || message.content },
  };
}

export function mapWsMessage(message: WsChatMessage): Message | null {
  const id = Number(message.id);
  const senderId = Number(message.user_id);

  if (!Number.isFinite(id) || !Number.isFinite(senderId)) {
    return null;
  }

  if (message.type === 'file' || message.type === 'sticker') {
    return mapFileMessage(message, id, senderId);
  }

  return {
    id,
    senderId,
    timestamp: message.time,
    message: { type: 'text', value: message.content },
  };
}

export function mapWsMessages(values: unknown[]): Message[] {
  return values.flatMap((value) => {
    if (!isWsChatMessage(value)) {
      return [];
    }

    const message = mapWsMessage(value);
    return message ? [message] : [];
  });
}
