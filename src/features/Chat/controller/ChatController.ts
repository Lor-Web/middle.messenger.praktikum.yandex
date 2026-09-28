import GlobalStore from '@/core/GlobalStore/GlobalStore';
import ChatsApi from '@/shared/api/ChatsApi';
import type { UserResponse } from '@/shared/models/api/auth.type';

import messagesSocket from '../api/MessagesSocket';
import type ChatView from '../view/ChatView';

export default class ChatController extends ChatsApi {
  private chatId: number | null = null;

  constructor(private view: ChatView) {
    super();
  }

  init(): void {
    const chatId = Number(this.view.getChatId());
    const user = GlobalStore.getState('user') as UserResponse | undefined;

    if (!Number.isInteger(chatId) || chatId <= 0 || !user?.id) {
      return;
    }

    this.chatId = chatId;
    messagesSocket.attach(chatId, (messages) => {
      if (this.chatId !== chatId) {
        return;
      }

      this.view.renderMessages(messages);
    });

    if (messagesSocket.isActive(chatId)) {
      return;
    }

    this.openConnection(chatId, user.id);
  }

  destroy(): void {
    this.chatId = null;
    messagesSocket.detach();
  }

  private openConnection(chatId: number, userId: number): void {
    const requestToken = (id: number) => this.token(id).then((response) => response.token);

    requestToken(chatId)
      .then((token) => {
        if (this.chatId !== chatId) {
          return;
        }

        messagesSocket.connect({
          userId,
          chatId,
          token,
          requestToken,
        });
      })
      .catch(() => undefined);
  }
}
