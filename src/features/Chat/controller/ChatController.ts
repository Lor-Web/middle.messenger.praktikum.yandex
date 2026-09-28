import GlobalStore from '@/core/GlobalStore/GlobalStore';
import ChatsApi from '@/shared/api/ChatsApi';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Message } from '@/shared/models/base.type';

import messagesSocket from '../api/MessagesSocket';
import {
  enrichMessages,
  forgetChatUsersLoad,
  getChatUsers,
  onChatUsers,
  rememberChatUsers,
  rememberCurrentUser,
  shouldLoadChatUsers,
  syncChatPreview,
} from '../lib/syncChatPreview';
import type ChatView from '../view/ChatView';

export default class ChatController {
  private chatsApi = new ChatsApi();
  private chatId: number | null = null;
  private messages: Message[] = [];
  private unsubscribeUsers: (() => void) | null = null;

  constructor(private view: ChatView) {}

  init(): void {
    const chatId = Number(this.view.getChatId());
    const user = GlobalStore.getState('user') as UserResponse | undefined;

    if (!Number.isInteger(chatId) || chatId <= 0 || !user?.id) {
      return;
    }

    this.chatId = chatId;
    rememberCurrentUser(user);
    this.unsubscribeUsers = onChatUsers((id, users) => {
      if (this.chatId !== chatId || id !== chatId) {
        return;
      }

      this.view.renderParticipants(users);
      this.view.renderMessages(enrichMessages(this.messages));
    });
    messagesSocket.attach(chatId, (messages) => {
      if (this.chatId !== chatId) {
        return;
      }

      this.messages = messages;
      this.view.renderMessages(enrichMessages(messages));
      syncChatPreview(chatId, messages);
    });
    this.loadAuthors(chatId);

    if (messagesSocket.isActive(chatId)) {
      return;
    }

    this.openConnection(chatId, user.id);
  }

  destroy(): void {
    this.chatId = null;
    this.messages = [];
    this.unsubscribeUsers?.();
    this.unsubscribeUsers = null;
    messagesSocket.detach();
  }

  private loadAuthors(chatId: number): void {
    const cached = getChatUsers(chatId);

    if (cached) {
      this.view.renderParticipants(cached);
    }

    if (!shouldLoadChatUsers(chatId)) {
      return;
    }

    this.chatsApi
      .chatUsers(chatId, {})
      .then((users) => {
        rememberChatUsers(chatId, users);

        if (this.chatId === chatId) {
          syncChatPreview(chatId, this.messages);
        }
      })
      .catch(() => {
        forgetChatUsersLoad(chatId);
      });
  }

  private openConnection(chatId: number, userId: number): void {
    const requestToken = (id: number) => this.chatsApi.token(id).then((response) => response.token);

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
