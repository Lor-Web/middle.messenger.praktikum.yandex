import Block from '@/core/Block/Block';
import { chatPath } from '@/shared/constants/paths.constant';

import type { ChatEditViewProps } from '../types/chatEdit.type';

export default class ChatEditView extends Block<ChatEditViewProps> {
  static componentName = 'ChatEditView';

  constructor(props: ChatEditViewProps = {} as ChatEditViewProps) {
    const chat =
      props.chat ?? props.chats?.find((item) => String(item.id) === String(props.chatId));

    super({
      ...props,
      chat,
      backHref: props.chatId ? chatPath(props.chatId) : undefined,
    });
  }

  protected template = `
    {{#if chat}}
      <div class="chat-edit">
        <header class="chat-edit__header">
          {{{ Button link=true href=backHref label="Назад" transparent=true size="small" }}}
          <h1 class="chat-edit__title">{{chat.title}}</h1>
        </header>

        <div class="chat-edit__sections">
          <section class="chat-edit__section">
            <h2 class="chat-edit__section-title">Добавить пользователя</h2>
            {{{ UserSearchView chatId=chatId }}}
          </section>

          <section class="chat-edit__section">
            <h2 class="chat-edit__section-title">Пользователи чата</h2>
            {{{ ChatMembersView chatId=chatId }}}
          </section>
        </div>
      </div>
    {{else}}
      <div class="dashboard-window">
        <p>Чат не найден</p>
      </div>
    {{/if}}
  `;
}
