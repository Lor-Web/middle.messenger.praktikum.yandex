import AuthApi from '@/shared/api/AuthApi';
import ChatsApi from '@/shared/api/ChatsApi';

import GlobalStore from './GlobalStore';

const authApi = new AuthApi();
const chatsApi = new ChatsApi();

let userRequest: Promise<unknown> | null = null;
let chatsRequest: Promise<unknown> | null = null;

export function loadUser() {
  if (GlobalStore.getState('user')) {
    return Promise.resolve();
  }

  if (!userRequest) {
    userRequest = authApi
      .user()
      .then((user) => {
        GlobalStore.setState('user', user);
      })
      .catch(() => undefined)
      .finally(() => {
        userRequest = null;
      });
  }

  return userRequest;
}

export function loadChats() {
  if (GlobalStore.getState('chats')) {
    return Promise.resolve();
  }

  if (!chatsRequest) {
    chatsRequest = chatsApi
      .chats({})
      .then((chats) => {
        GlobalStore.setState('chats', chats);
      })
      .catch(() => undefined)
      .finally(() => {
        chatsRequest = null;
      });
  }

  return chatsRequest;
}

export function loadAppData() {
  return Promise.all([loadUser(), loadChats()]);
}
