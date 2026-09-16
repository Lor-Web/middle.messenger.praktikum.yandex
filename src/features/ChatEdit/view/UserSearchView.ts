import Block from '@/core/Block/Block';

import UserSearchController from '../controller/UserSearchController';
import { UserSearchModel } from '../models/UserSearchModel';
import type { UserSearchViewProps } from '../types/userSearch.type';

export default class UserSearchView extends Block<UserSearchViewProps> {
  static componentName = 'UserSearchView';

  private model: UserSearchModel | null = null;
  private controller: UserSearchController | null = null;

  constructor(props: UserSearchViewProps = {} as UserSearchViewProps) {
    super({
      addDisabled: true,
      ...props,
    });
  }

  protected componentDidMount(): void {
    if (!this.model) {
      this.model = new UserSearchModel();
    }

    if (!this.controller) {
      this.controller = new UserSearchController(this.model, this);
    }

    this.controller.init();
  }

  public getChatId(): string | undefined {
    return this.props.chatId;
  }

  protected template = `
    <div class="user-search">
      {{{ Input
        name="login"
        label="Логин"
        placeholder="Логин пользователя"
        value=query
      }}}

      {{{ Button
        label="Добавить пользователей"
        type="button"
        ref="addUsersBtn"
        disabled=addDisabled
      }}}

      {{#if error}}
        <p class="error-text">{{error}}</p>
      {{/if}}

      {{#if hasUsers}}
        <ul class="user-search__list" ref="userList">
          {{#each users}}
            {{{ UserSearchItem user=this }}}
          {{/each}}
        </ul>
      {{else if didSearch}}
        <p class="user-search__empty">Пользователи не найдены</p>
      {{/if}}
    </div>
  `;
}
