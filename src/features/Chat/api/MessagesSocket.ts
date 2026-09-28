import WSTransport from '@/core/WebSocket/WSTransport';
import { wsHost } from '@/shared/constants/api.constant';
import { isWsChatMessage } from '@/shared/models/api/messages.type';
import type { Message } from '@/shared/models/base.type';

import { mapWsMessage, mapWsMessages } from '../lib/mapWsMessage';

const HISTORY_PAGE = 20;
const HISTORY_LIMIT = 1000;
const RECONNECT_DELAY = 3000;
const RECONNECT_ATTEMPTS = 5;

type MessagesListener = (messages: Message[]) => void;

type ConnectParams = {
  userId: number;
  chatId: number;
  token: string;
  requestToken: (chatId: number) => Promise<string>;
};

class MessagesSocket {
  private transport: WSTransport | null = null;
  private listener: MessagesListener | null = null;
  private messages: Message[] = [];
  private pendingMessages: string[] = [];
  private activeChatId: number | null = null;
  private requestedChatId: number | null = null;
  private userId: number | null = null;
  private requestToken: ((chatId: number) => Promise<string>) | null = null;
  private historyOffset = 0;
  private historyDone = false;
  private retained = false;
  private generation = 0;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  public attach(chatId: number, listener: MessagesListener): void {
    this.cancelClose();
    this.retained = true;
    this.listener = listener;
    this.requestedChatId = chatId;

    if (this.activeChatId !== chatId) {
      this.closeTransport();
      this.messages = [];
      this.pendingMessages = [];
      this.historyOffset = 0;
      this.historyDone = false;
      this.reconnectAttempt = 0;
      this.activeChatId = null;
      listener([]);
      return;
    }

    listener(this.messages);
  }

  public detach(): void {
    this.retained = false;
    this.listener = null;
    this.scheduleClose();
  }

  public isActive(chatId: number): boolean {
    if (this.activeChatId !== chatId || !this.transport) {
      return false;
    }

    return (
      this.transport.readyState === WebSocket.OPEN ||
      this.transport.readyState === WebSocket.CONNECTING
    );
  }

  public connect({ userId, chatId, token, requestToken }: ConnectParams): void {
    if (!this.retained || this.requestedChatId !== chatId) {
      return;
    }

    if (this.isActive(chatId)) {
      return;
    }

    if (this.activeChatId !== chatId) {
      this.reconnectAttempt = 0;
    }

    this.closeTransport();
    this.userId = userId;
    this.activeChatId = chatId;
    this.requestToken = requestToken;
    this.historyOffset = 0;
    this.historyDone = false;

    const generation = this.generation;
    const transport = new WSTransport(this.socketUrl(userId, chatId, token), {
      onOpen: () => {
        if (generation !== this.generation) {
          return;
        }

        this.reconnectAttempt = 0;
        this.historyOffset = 0;
        this.historyDone = false;
        this.requestHistory();
        this.flushPending();
      },
      onMessage: (data) => {
        if (generation !== this.generation) {
          return;
        }

        this.handleData(data);
      },
      onClose: () => {
        if (generation !== this.generation) {
          return;
        }

        this.transport = null;
        this.scheduleReconnect();
      },
    });

    this.transport = transport;
    transport.connect();
  }

  public sendMessage(content: string): void {
    const text = content.trim();

    if (!text) {
      return;
    }

    const sent = this.transport?.send({ type: 'message', content: text }) ?? false;

    if (!sent) {
      this.pendingMessages.push(text);
    }
  }

  private socketUrl(userId: number, chatId: number, token: string): string {
    return `${wsHost}${userId}/${chatId}/${encodeURIComponent(token)}`;
  }

  private requestHistory(): void {
    if (this.historyDone || this.historyOffset >= HISTORY_LIMIT) {
      this.historyDone = true;
      return;
    }

    this.transport?.send({ type: 'get old', content: String(this.historyOffset) });
  }

  private handleData(data: unknown): void {
    if (Array.isArray(data)) {
      this.handleHistory(data);
      return;
    }

    if (!isWsChatMessage(data)) {
      return;
    }

    const message = mapWsMessage(data);

    if (!message) {
      return;
    }

    this.merge([message]);
    this.emit();
  }

  private handleHistory(data: unknown[]): void {
    const batch = mapWsMessages(data);
    const added = this.merge(batch);
    this.emit();

    if (data.length < HISTORY_PAGE || added === 0 || this.historyOffset >= HISTORY_LIMIT) {
      this.historyDone = true;
      return;
    }

    this.historyOffset += data.length;
    this.requestHistory();
  }

  private merge(incoming: Message[]): number {
    const byId = new Map(this.messages.map((message) => [message.id, message]));
    let added = 0;

    incoming.forEach((message) => {
      if (!byId.has(message.id)) {
        added += 1;
      }

      byId.set(message.id, message);
    });

    this.messages = [...byId.values()].sort((left, right) => left.id - right.id);
    return added;
  }

  private flushPending(): void {
    const queue = this.pendingMessages.splice(0);

    queue.forEach((content) => {
      this.transport?.send({ type: 'message', content });
    });
  }

  private emit(): void {
    this.listener?.(this.messages);
  }

  private scheduleReconnect(): void {
    if (!this.retained || this.activeChatId == null || this.userId == null || !this.requestToken) {
      return;
    }

    if (this.reconnectAttempt >= RECONNECT_ATTEMPTS) {
      return;
    }

    const chatId = this.activeChatId;
    const userId = this.userId;
    const requestToken = this.requestToken;
    this.reconnectAttempt += 1;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;

      if (!this.retained || this.requestedChatId !== chatId) {
        return;
      }

      requestToken(chatId)
        .then((token) => {
          this.connect({ userId, chatId, token, requestToken });
        })
        .catch(() => {
          this.scheduleReconnect();
        });
    }, RECONNECT_DELAY);
  }

  private scheduleClose(): void {
    this.cancelClose();
    this.closeTimer = setTimeout(() => {
      this.closeTimer = null;

      if (this.retained) {
        return;
      }

      this.closeTransport();
      this.messages = [];
      this.pendingMessages = [];
      this.activeChatId = null;
      this.requestedChatId = null;
      this.userId = null;
      this.requestToken = null;
      this.historyOffset = 0;
      this.historyDone = false;
    }, 0);
  }

  private cancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private closeTransport(): void {
    this.generation += 1;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.transport?.close();
    this.transport = null;
  }
}

export default new MessagesSocket();
