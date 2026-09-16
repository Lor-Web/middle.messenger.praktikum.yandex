import Block from '@/core/Block/Block';
import Router from '@/core/Router/Router';
import { chatEditPath } from '@/shared/constants/paths.constant';
import { listenerForChild } from '@/shared/lib/setListenerForChild';

import ChatController from '../controller/ChatController';
import type { ChatViewProps } from '../types/chat.type';

export default class ChatView extends Block<ChatViewProps> {
  static componentName = 'ChatView';

  private controller: ChatController | null = null;
  private _router = new Router();

  constructor(props: ChatViewProps = {} as ChatViewProps) {
    super({
      ...props,
      chat: props.chat ?? props.chats?.find((chat) => String(chat.id) === String(props.chatId)),
    });
  }

  protected componentDidMount(): void {
    this.controller = new ChatController(this);
    this.controller.init();

    console.log(this.props);

    const editBtn = this.getRef('editBtn');
    if (editBtn instanceof HTMLButtonElement) {
      listenerForChild.set({
        element: editBtn,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          if (this.getChatId()) {
            this._router.go(chatEditPath(this.getChatId()!));
          }
        },
      });
    }
  }

  protected componentWillUnmount(): void {
    this.controller?.destroy();
    this.controller = null;
  }

  public getChatId(): string | undefined {
    return this.props.chatId ?? (this.props.chat ? String(this.props.chat.id) : undefined);
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
            {{{ Button icon='ellipsis-vertical' transparent=true ref='editBtn' }}}
          </div>
        </header>

        <section class="chat-window__messages"></section>

        <footer class="chat-window__footer">
          {{{ ChatFormView }}}
        </footer>
      </div>
    {{else}}
      <div class="dashboard-window">
        <p>Чат не найден</p>
      </div>
    {{/if}}
  `;
}
