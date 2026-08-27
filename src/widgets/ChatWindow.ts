import Block, { type BlockOwnProps } from '../core/Block/Block';

export interface ChatWindowProps extends BlockOwnProps {
  chat: ChatWindow;
}

export default class ChatWindow extends Block<ChatWindowProps> {
  static componentName = 'ChatWindow';

  protected template = `
    <div class="chat-window">
      <header class="chat-window__header">
        <img
          class="avatar avatar_medium"
          src="{{chat.companion.avatar}}"
        />

        <div class="chat-window__companion">
          <h3 class="chat-window__companion-name">{{chat.companion.name}}</h3>
          {{#if chat.companion.online}}
            <p class="chat-window__companion-status">Online</p>
          {{/if}}
        </div>

        <div class="chat-window__settings">
          {{{ Button icon='ellipsis-vertical' transparent=true }}}
        </div>
      </header>

      <section class="chat-window__messages">
        {{#each chat.messages}}
          {{{ MessageItem message=this}}}
        {{/each}}
      </section>

      <footer class="chat-window__footer">
        {{{ ChatWindowFormView }}}
      </footer>
    </div>
  `;
}
