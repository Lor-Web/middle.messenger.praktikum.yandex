import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import GlobalStore from '@/core/GlobalStore/GlobalStore';
import Router from '@/core/Router/Router';

import { chatPath } from '../constants/paths.constant';
import { listenerForChild } from '../lib/setListenerForChild';
import type { UserResponse } from '../models/api/auth.type';
import type { Chat } from '../models/api/chats.type';

export interface ChatItemProps extends BlockOwnProps {
  chat: Chat;
  myMessage?: boolean;
}

export default class ChatItem extends Block<ChatItemProps> {
  static componentName = 'ChatItem';

  private _router = new Router();

  constructor(props: ChatItemProps) {
    const user = GlobalStore.getState('user') as UserResponse | undefined;
    const lastMessageUser = props.chat.last_message?.user;

    super({
      ...props,
      myMessage: Boolean(user && lastMessageUser && lastMessageUser.login === user.login),
    });
  }

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
        {{{ Avatar src=chat.avatar alt=chat.title }}}
      </div>

      <div class="chat-item__user">
        <h2 class="chat-item__user-name">{{chat.title}}</h2>
        {{#if chat.last_message}}
          <p class="chat-item__user-message">
            {{#if myMessage}}
              <b>Вы:</b>
            {{/if}}
            {{chat.last_message.content}}
          </p>
        {{/if}}
      </div>

      <div class="chat-item__info">
        {{#if chat.last_message.time}}
          <p class="chat-item__info-date">{{formatDate chat.last_message.time}}</p>
        {{/if}}
        {{#if chat.unread_count}}
          {{{ Counter count=chat.unread_count }}}
        {{/if}}
      </div>
    </a>
  `;
}
