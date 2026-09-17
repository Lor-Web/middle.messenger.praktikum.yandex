import GlobalStore from '@/core/GlobalStore/GlobalStore';
import ChatsApi from '@/shared/api/ChatsApi';
import UserApi from '@/shared/api/UserApi';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type { UserSearchModel } from '../models/UserSearchModel';
import type UserSearchItem from '../view/UserSearchItem';
import type UserSearchView from '../view/UserSearchView';

const SEARCH_DELAY_MS = 300;

export default class UserSearchController extends UserApi {
  private chatsApi = new ChatsApi();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchSeq = 0;
  private isAdding = false;

  constructor(
    private model: UserSearchModel,
    private view: UserSearchView,
  ) {
    super();
  }

  init(): void {
    this.removeListeners();
    this.attachListeners();
  }

  private attachListeners(): void {
    const addUsersBtn = this.view.getRef('addUsersBtn');

    if (addUsersBtn instanceof HTMLButtonElement) {
      listenerForChild.set({
        element: addUsersBtn,
        eventName: 'click',
        eventCallback: this.handleAddUsers,
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
    const addUsersBtn = this.view.getRef('addUsersBtn');

    if (addUsersBtn instanceof HTMLButtonElement) {
      listenerForChild.remove({
        element: addUsersBtn,
        eventName: 'click',
        eventCallback: this.handleAddUsers,
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

  private handleAddUsers = (): void => {
    const chatId = Number(this.view.getChatId());
    const users = this.model.getSelectedIds();

    if (this.isAdding || !chatId || users.length === 0) {
      return;
    }

    this.isAdding = true;
    this.updateView();

    this.chatsApi
      .addUser({ users, chatId })
      .then(() => this.chatsApi.chats({}))
      .then((chats) => {
        GlobalStore.setState('chats', chats);
        this.model.clearSelected();
        this.model.setError(undefined);
      })
      .catch((error: { response?: string }) => {
        this.model.setError(error.response ?? 'Не удалось добавить пользователей');
      })
      .finally(() => {
        this.isAdding = false;
        this.updateView();
      });
  };

  private scheduleSearch(query: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    const login = query.trim();

    if (!login) {
      this.searchSeq += 1;
      this.model.setUsers([]);
      this.model.setError(undefined);
      this.model.setDidSearch(false);
      this.updateView({ restoreFocus: true });
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.search(login);
    }, SEARCH_DELAY_MS);
  }

  private search(login: string): void {
    const seq = ++this.searchSeq;

    this.searchUsers({ login })
      .then((users) => {
        if (seq !== this.searchSeq || this.model.getQuery().trim() !== login) {
          return;
        }

        this.model.setUsers(users);
        this.model.setError(undefined);
        this.model.setDidSearch(true);
        this.updateView({ restoreFocus: true });
      })
      .catch((error: { response?: string }) => {
        if (seq !== this.searchSeq) {
          return;
        }

        this.model.setUsers([]);
        this.model.setError(error.response ?? 'Не удалось найти пользователей');
        this.model.setDidSearch(true);
        this.updateView({ restoreFocus: true });
      });
  }

  private updateView(options: { restoreFocus?: boolean } = {}): void {
    const users = this.model.getUsers();
    const addDisabled = this.model.getSelectedIds().length === 0 || this.isAdding;

    this.view.setProps({
      query: this.model.getQuery(),
      users: users.map((user) => ({
        ...user,
        selected: this.model.isSelected(user.id),
      })),
      error: this.model.getError(),
      didSearch: this.model.getDidSearch(),
      hasUsers: users.length > 0,
      addDisabled,
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
