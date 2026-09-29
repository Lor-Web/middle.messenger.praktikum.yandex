import GlobalStore from '@/core/GlobalStore/GlobalStore';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat, ChatUserResponse } from '@/shared/models/api/chats.type';
import type { Message } from '@/shared/models/base.type';

type LastMessageUser = NonNullable<Chat['last_message']>['user'];

const authors = new Map<number, LastMessageUser>();
const chatUsers = new Map<number, ChatUserResponse[]>();
const loadedChats = new Set<number>();
const loadingChats = new Set<number>();
const userListeners = new Set<(chatId: number, users: ChatUserResponse[]) => void>();

const emptyAuthor = (): LastMessageUser => ({
  first_name: '',
  second_name: '',
  avatar: '',
  email: '',
  login: '',
  phone: '',
});

export function resetChatPreviewCache(): void {
  authors.clear();
  chatUsers.clear();
  loadedChats.clear();
  loadingChats.clear();
}

export function rememberCurrentUser(user: UserResponse): void {
  authors.set(user.id, {
    first_name: user.first_name,
    second_name: user.second_name,
    avatar: user.avatar || '',
    email: user.email,
    login: user.login,
    phone: user.phone,
  });
}

export function shouldLoadChatUsers(chatId: number): boolean {
  if (loadedChats.has(chatId) || loadingChats.has(chatId)) {
    return false;
  }

  loadingChats.add(chatId);
  return true;
}

export function getChatUsers(chatId: number): ChatUserResponse[] | undefined {
  return chatUsers.get(chatId);
}

export function onChatUsers(
  listener: (chatId: number, users: ChatUserResponse[]) => void,
): () => void {
  userListeners.add(listener);

  return () => {
    userListeners.delete(listener);
  };
}

export function rememberChatUsers(chatId: number, users: ChatUserResponse[]): void {
  loadingChats.delete(chatId);
  loadedChats.add(chatId);
  chatUsers.set(chatId, users);

  users.forEach((user) => {
    authors.set(user.id, {
      first_name: user.first_name,
      second_name: user.second_name,
      avatar: user.avatar || '',
      email: '',
      login: user.login,
      phone: '',
    });
  });

  userListeners.forEach((listener) => listener(chatId, users));
}

export function enrichMessages(messages: Message[]): Message[] {
  return messages.map((message) => {
    const author = authors.get(message.senderId);

    if (!author) {
      return message;
    }

    return {
      ...message,
      senderName: author.first_name,
      senderAvatar: author.avatar,
    };
  });
}

export function forgetChatUsersLoad(chatId: number): void {
  loadingChats.delete(chatId);
}

export function syncChatPreview(chatId: number, messages: Message[]): void {
  const last = messages[messages.length - 1];

  if (!last) {
    return;
  }

  const chats = GlobalStore.getState('chats') as Chat[] | undefined;

  if (!chats) {
    return;
  }

  const author = authors.get(last.senderId) ?? emptyAuthor();
  const content = last.message.type === 'text' ? last.message.value : 'Файл';
  const current = chats.find((chat) => chat.id === chatId)?.last_message;

  if (
    current?.content === content &&
    current.time === last.timestamp &&
    current.user.first_name === author.first_name &&
    current.user.login === author.login
  ) {
    return;
  }

  GlobalStore.setState(
    'chats',
    chats.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            last_message: {
              user: author,
              time: last.timestamp,
              content,
            },
          }
        : chat,
    ),
  );
}
