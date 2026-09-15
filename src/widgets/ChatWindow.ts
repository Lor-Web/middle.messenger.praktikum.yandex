import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { Chat } from '@/shared/models/api/chats.type';

export interface ChatWindowProps extends BlockOwnProps {
  chat?: Chat;
  chats?: Chat[];
  chatId?: string;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  static componentName = 'ChatWindow';

  constructor(props: ChatWindowProps = {} as ChatWindowProps) {
    super({
      ...props,
      chat: props.chat ?? props.chats?.find((chat) => String(chat.id) === String(props.chatId)),
    });
  }

  protected template = `
    {{#if chat}}
      <div class="chat-window">
        <header class="chat-window__header">
          {{{ Avatar src=chat.avatar alt=chat.title size='medium' }}}

          <div class="chat-window__companion">
            <h3 class="chat-window__companion-name">{{chat.title}}</h3>
          </div>

          <div class="chat-window__settings">
            {{{ Button icon='ellipsis-vertical' transparent=true }}}
          </div>
        </header>

        <section class="chat-window__messages"></section>

        <footer class="chat-window__footer">
          {{{ ChatWindowFormView }}}
        </footer>
      </div>
    {{else}}
      <div class="dashboard-window">
        <p>Чат не найден</p>
      </div>
    {{/if}}
  `;
}
