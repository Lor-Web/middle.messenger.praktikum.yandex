import type { WsClientMessage } from '@/shared/models/api/messages.type';

const PING_INTERVAL = 10000;

type WSTransportHandlers = {
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (data: unknown) => void;
};

export default class WSTransport {
  private socket: WebSocket | null = null;
  private pingTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private url: string,
    private handlers: WSTransportHandlers = {},
  ) {}

  public get readyState(): number {
    return this.socket?.readyState ?? WebSocket.CLOSED;
  }

  public connect(): void {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    const socket = new WebSocket(this.url);
    this.socket = socket;

    socket.addEventListener('open', () => {
      this.startPing();
      this.handlers.onOpen?.();
    });

    socket.addEventListener('close', () => {
      this.stopPing();
      this.handlers.onClose?.();
    });

    socket.addEventListener('message', (event) => {
      try {
        this.handlers.onMessage?.(JSON.parse(String(event.data)) as unknown);
      } catch (_error) {
        return;
      }
    });
  }

  public send(data: WsClientMessage): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.socket.send(JSON.stringify(data));
    return true;
  }

  public close(): void {
    this.stopPing();
    const socket = this.socket;
    this.socket = null;
    socket?.close();
  }

  private startPing(): void {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.send({ type: 'ping' });
    }, PING_INTERVAL);
  }

  private stopPing(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
