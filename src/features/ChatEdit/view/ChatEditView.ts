import Block from '@/core/Block/Block';
import { chatPath } from '@/shared/constants/paths.constant';

import ChatEditController from '../controller/ChatEditController';
import type { ChatEditViewProps } from '../types/chatEdit.type';

export default class ChatEditView extends Block<ChatEditViewProps> {
  static componentName = 'ChatEditView';

  private controller: ChatEditController | null = null;

  constructor(props: ChatEditViewProps = {} as ChatEditViewProps) {
    const chat =
      props.chat ?? props.chats?.find((item) => String(item.id) === String(props.chatId));

    super({
      ...props,
      chat,
      backHref: props.chatId ? chatPath(props.chatId) : undefined,
    });
  }

  protected componentDidMount(): void {
    if (!this.controller) {
      this.controller = new ChatEditController(this);
    }

    this.controller.init();
  }

  public getChatId(): string | undefined {
    return this.props.chatId ?? (this.props.chat ? String(this.props.chat.id) : undefined);
  }

  protected template = `
    {{#if chat}}
      <div class="chat-edit">
        <header class="chat-edit__header">
          {{{ Button link=true href=backHref label="Назад" variant="transparent" size="small" }}}
          <h1 class="chat-edit__title">{{chat.title}}</h1>
        </header>

        <div class="chat-edit__sections">
          <section class="chat-edit__section">
            <h2 class="chat-edit__section-title">Добавить пользователя</h2>
            {{{ UserSearchView chatId=chatId }}}
          </section>

          <section class="chat-edit__section">
            <h2 class="chat-edit__section-title">Пользователи чата</h2>
            {{{ ChatMembersView chatId=chatId currentUserId=user.id }}}
          </section>
        </div>

        <div class="chat-edit__actions">
          {{{ Button
            label="Удалить чат"
            type="button"
            variant="delete"
            ref="deleteChatBtn"
            disabled=deleteChatDisabled
          }}}
        </div>

        {{#if error}}
          <p class="error-text">{{error}}</p>
        {{/if}}
      </div>
    {{else}}
      <div class="dashboard-window">
        <p>Чат не найден</p>
      </div>
    {{/if}}
  `;
}
