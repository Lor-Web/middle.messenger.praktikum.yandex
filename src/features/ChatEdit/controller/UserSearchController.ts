import UserApi from '@/shared/api/UserApi';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import type { UserSearchModel } from '../models/UserSearchModel';
import type UserSearchItem from '../view/UserSearchItem';
import type UserSearchView from '../view/UserSearchView';

const SEARCH_DELAY_MS = 300;

export default class UserSearchController extends UserApi {
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private searchSeq = 0;

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
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.set({
          element: input,
          eventName: 'input',
          eventCallback: this.handleInput,
        });
      }

      const addBtn = child.getRef('addBtn');

      if (addBtn instanceof HTMLButtonElement) {
        listenerForChild.set({
          element: addBtn,
          eventName: 'click',
          eventCallback: this.handleAddClick,
        });
      }
    });
  }

  private removeListeners(): void {
    this.view.children.forEach((child) => {
      const input = child.getRef('input');

      if (input instanceof HTMLInputElement) {
        listenerForChild.remove({
          element: input,
          eventName: 'input',
          eventCallback: this.handleInput,
        });
      }

      const addBtn = child.getRef('addBtn');

      if (addBtn instanceof HTMLButtonElement) {
        listenerForChild.remove({
          element: addBtn,
          eventName: 'click',
          eventCallback: this.handleAddClick,
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

  private handleAddClick = (e: Event): void => {
    const button = e.currentTarget;

    if (!(button instanceof HTMLButtonElement)) {
      return;
    }

    const item = this.view.children.find((child) => child.getRef('addBtn') === button) as
      UserSearchItem | undefined;
    const userId = item?.getUserId();
    const chatId = this.view.getChatId();

    if (userId === undefined || !chatId) {
      return;
    }

    // this.addUserToChat(userId, chatId);
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
      this.updateView();
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
        this.updateView();
      })
      .catch((error: { response?: string }) => {
        if (seq !== this.searchSeq) {
          return;
        }

        this.model.setUsers([]);
        this.model.setError(error.response ?? 'Не удалось найти пользователей');
        this.model.setDidSearch(true);
        this.updateView();
      });
  }

  private addUserToChat(): void {
    // API добавления пользователя в чат ещё не подключено.
  }

  private updateView(): void {
    const users = this.model.getUsers();

    this.view.setProps({
      query: this.model.getQuery(),
      users,
      error: this.model.getError(),
      didSearch: this.model.getDidSearch(),
      hasUsers: users.length > 0,
    });

    this.focusSearchInput();
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
