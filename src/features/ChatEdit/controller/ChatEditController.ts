import GlobalStore from '@/core/GlobalStore/GlobalStore';
import Router from '@/core/Router/Router';
import ChatsApi from '@/shared/api/ChatsApi';
import { MESSENGER_PATH } from '@/shared/constants/paths.constant';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type ChatEditView from '../view/ChatEditView';

export default class ChatEditController extends ChatsApi {
  private _router = new Router();
  private isDeleting = false;

  constructor(private view: ChatEditView) {
    super();
  }

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const deleteChatBtn = this.view.getRef('deleteChatBtn');

    if (deleteChatBtn instanceof HTMLButtonElement) {
      listenerForChild.set({
        element: deleteChatBtn,
        eventName: 'click',
        eventCallback: this.handleDeleteChat,
      });
    }
  }

  private removeListeners(): void {
    const deleteChatBtn = this.view.getRef('deleteChatBtn');

    if (deleteChatBtn instanceof HTMLButtonElement) {
      listenerForChild.remove({
        element: deleteChatBtn,
        eventName: 'click',
        eventCallback: this.handleDeleteChat,
      });
    }
  }

  private handleDeleteChat = (): void => {
    const chatId = Number(this.view.getChatId());

    if (this.isDeleting || !chatId) {
      return;
    }

    this.isDeleting = true;
    this.view.setProps({ deleteChatDisabled: true, error: undefined });

    this.deleteChat({ chatId })
      .then(() => this.chats({}))
      .then((chats) => {
        GlobalStore.setState('chats', chats);
        this._router.go(MESSENGER_PATH);
      })
      .catch((error: { response?: string }) => {
        this.isDeleting = false;
        this.view.setProps({
          deleteChatDisabled: false,
          error: error.response ?? 'Не удалось удалить чат',
        });
      });
  };
}
