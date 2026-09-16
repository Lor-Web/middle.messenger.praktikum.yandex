import GlobalStore from '@/core/GlobalStore/GlobalStore';
import ChatsApi from '@/shared/api/ChatsApi';
import { listenerForChild } from '@/shared/lib/setListenerForChild';
import type { GetChatUsersRequest } from '@/shared/models/api/chats.type';

import type { ChatMembersModel } from '../models/ChatMembersModel';
import type ChatMembersView from '../view/ChatMembersView';
import type UserSearchItem from '../view/UserSearchItem';

const SEARCH_DELAY_MS = 300;

export default class ChatMembersController extends ChatsApi {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchSeq = 0;
  private isDeleting = false;
  private didInitLoad = false;

  constructor(
    private model: ChatMembersModel,
    private view: ChatMembersView,
  ) {
    super();
  }

  init(): void {
    this.removeListeners();
    this.attachListeners();

    if (!this.didInitLoad) {
      this.didInitLoad = true;
      this.search(this.model.getQuery());
    }
  }

  private attachListeners(): void {
    const deleteUsersBtn = this.view.getRef('deleteUsersBtn');

    if (deleteUsersBtn instanceof HTMLButtonElement) {
      listenerForChild.set({
        element: deleteUsersBtn,
        eventName: 'click',
        eventCallback: this.handleDeleteUsers,
      });
    }

    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.set({
          element: input,
          eventName: 'input',
          eventCallback: this.handleInput,
        });
      }

      const selectBtn = child.getRef('selectBtn');

      if (selectBtn instanceof HTMLButtonElement) {
        listenerForChild.set({
          element: selectBtn,
          eventName: 'click',
          eventCallback: this.handleSelectClick,
        });
      }
    });
  }

  private removeListeners(): void {
    const deleteUsersBtn = this.view.getRef('deleteUsersBtn');

    if (deleteUsersBtn instanceof HTMLButtonElement) {
      listenerForChild.remove({
        element: deleteUsersBtn,
        eventName: 'click',
        eventCallback: this.handleDeleteUsers,
      });
    }

    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.remove({
          element: input,
          eventName: 'input',
          eventCallback: this.handleInput,
        });
      }

      const selectBtn = child.getRef('selectBtn');

      if (selectBtn instanceof HTMLButtonElement) {
        listenerForChild.remove({
          element: selectBtn,
          eventName: 'click',
          eventCallback: this.handleSelectClick,
        });
      }
    });
  }

  private handleInput = (e: Event): void => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }

    const query = e.target.value;
    this.model.setQuery(query);
    this.scheduleSearch(query);
  };

  private handleSelectClick = (e: Event): void => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const item = this.view.children.find((child) => child.getRef('selectBtn') === button) as
      UserSearchItem | undefined;
    const userId = item?.getUserId();

    if (userId === undefined) {
      return;
    }

    this.model.toggleSelected(userId);
    this.updateView();
  };

  private handleDeleteUsers = (): void => {
    const chatId = Number(this.view.getChatId());
    const users = this.model.getSelectedIds();

    if (this.isDeleting || !chatId || users.length === 0) {
      return;
    }

    this.isDeleting = true;
    this.updateView();

    this.deleteUsers({ users, chatId })
      .then(() => this.chats({}))
      .then((chats) => {
        GlobalStore.setState('chats', chats);
        this.model.clearSelected();
        this.model.setError(undefined);
        return this.search(this.model.getQuery());
      })
      .catch((error: { response?: string }) => {
        this.model.setError(error.response ?? 'Не удалось удалить пользователей');
      })
      .finally(() => {
        this.isDeleting = false;
        this.updateView();
      });
  };

  private scheduleSearch(query: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.search(query, { restoreFocus: true });
    }, SEARCH_DELAY_MS);
  }

  private search(query: string, options: { restoreFocus?: boolean } = {}): Promise<void> {
    const chatId = Number(this.view.getChatId());

    if (!chatId) {
      return Promise.resolve();
    }

    const seq = ++this.searchSeq;
    const name = query.trim();
    const request: GetChatUsersRequest = {};

    if (name) {
      request.name = name;
    }

    return this.chatUsers(chatId, request)
      .then((users) => {
        if (seq !== this.searchSeq || this.model.getQuery().trim() !== name) {
          return;
        }

        this.model.setUsers(users);
        this.model.setError(undefined);
        this.model.setDidSearch(true);
        this.updateView({ restoreFocus: options.restoreFocus });
      })
      .catch((error: { response?: string }) => {
        if (seq !== this.searchSeq) {
          return;
        }

        this.model.setUsers([]);
        this.model.setError(error.response ?? 'Не удалось загрузить пользователей чата');
        this.model.setDidSearch(true);
        this.updateView({ restoreFocus: options.restoreFocus });
      });
  }

  private updateView(options: { restoreFocus?: boolean } = {}): void {
    const users = this.model.getUsers();
    const deleteDisabled = this.model.getSelectedIds().length === 0 || this.isDeleting;

    this.view.setProps({
      query: this.model.getQuery(),
      users: users.map((user) => ({
        ...user,
        selected: this.model.isSelected(user.id),
      })),
      error: this.model.getError(),
      didSearch: this.model.getDidSearch(),
      hasUsers: users.length > 0,
      deleteDisabled,
    });

    if (options.restoreFocus) {
      this.focusSearchInput();
    }
  }

  private focusSearchInput(): void {
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    });
  }
}
