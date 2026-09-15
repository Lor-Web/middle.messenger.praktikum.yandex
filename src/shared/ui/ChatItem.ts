import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import Router from '@/core/Router/Router';

import { chatPath } from '../constants/paths.constant';
import { listenerForChild } from '../lib/setListenerForChild';
import type { Chat } from '../models/api/chats.type';

export interface ChatItemProps extends BlockOwnProps {
  chat: Chat;
}

export default class ChatItem extends Block<ChatItemProps> {
  static componentName = 'ChatItem';

  private _router = new Router();

  protected componentDidMount(): void {
    const linkDashboard = this.getRef('linkDashboard');
    console.log('ChatItem', this.props);
    if (linkDashboard instanceof HTMLAnchorElement) {
      listenerForChild.set({
        element: linkDashboard,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._router.go(chatPath(this.props.chat.id));
        },
      });
    }
  }

  protected componentWillUnmount(): void {
    const linkDashboard = this.getRef('linkDashboard');
    if (linkDashboard instanceof HTMLAnchorElement) {
      listenerForChild.remove({
        element: linkDashboard,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._router.go(chatPath(this.props.chat.id));
        },
      });
    }
  }

  protected template = `
    <a class="chat-item" ref="linkDashboard">
      <div class="chat-item__avatar">
        {{{ Avatar src=chat.last_message.avatar alt=chat.last_message.first_name }}}
      </div>

      <div class="chat-item__user">
        <h2 class="chat-item__user-name">{{chat.title}}</h2>
        <p class="chat-item__user-message">
          {{#if chat.myMessage}}
            <b>Вы:</b>
          {{/if}}
          {{chat.content}}
        </p>
      </div>

      <div class="chat-item__info">
        {{#if chat.time}}
          <p class="chat-item__info-date">{{formatDate chat.time}}</p>
        {{/if}}
        {{#if chat.unread_count}}
          {{{ Counter count=chat.unread_count }}}
        {{/if}}
      </div>
    </a>
  `;
}
