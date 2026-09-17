import Block from '@/core/Block/Block';

import ChatMembersController from '../controller/ChatMembersController';
import { ChatMembersModel } from '../models/ChatMembersModel';
import type { ChatMembersViewProps } from '../types/chatMembers.type';

export default class ChatMembersView extends Block<ChatMembersViewProps> {
  static componentName = 'ChatMembersView';

  private model: ChatMembersModel | null = null;
  private controller: ChatMembersController | null = null;

  constructor(props: ChatMembersViewProps = {} as ChatMembersViewProps) {
    super({
      deleteDisabled: true,
      ...props,
    });
  }

  protected componentDidMount(): void {
    if (!this.model) {
      this.model = new ChatMembersModel();
    }

    if (!this.controller) {
      this.controller = new ChatMembersController(this.model, this);
    }

    this.controller.init();
  }

  public getChatId(): string | undefined {
    return this.props.chatId;
  }

  public getCurrentUserId(): number | undefined {
    const currentUserId = Number(this.props.currentUserId);

    return Number.isFinite(currentUserId) ? currentUserId : undefined;
  }

  protected template = `
    <div class="user-search">
      {{{ Input
        name="name"
        label="Имя"
        placeholder="Имя пользователя"
        value=query
      }}}

      {{{ Button
        label="Удалить пользователей"
        type="button"
        variant="delete"
        ref="deleteUsersBtn"
        disabled=deleteDisabled
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
