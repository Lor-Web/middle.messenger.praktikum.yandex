import Block, { type BlockOwnProps } from '../../core/Block/Block';
import type { ChatItem as ChatItemData } from '../models/base.type';

export interface ChatItemProps extends BlockOwnProps {
  chat: ChatItemData;
}

export default class ChatItem extends Block<ChatItemProps> {
  static componentName = 'ChatItem';

  protected template = `
    <a class="chat-item" href="/dashboard">
      <img class="chat-item__avatar avatar" src="{{chat.avatar}}" alt="{{chat.name}}" />

      <div class="chat-item__user">
        <h2 class="chat-item__user-name">{{chat.name}}</h2>
        <p class="chat-item__user-message">
          {{#if chat.myMessage}}
            <b>Вы:</b>
          {{/if}}
          {{chat.message}}
        </p>
      </div>

      <div class="chat-item__info">
        <p class="chat-item__info-date">{{formatDate chat.date}}</p>
        {{#if chat.count}}
          {{{ Counter count=chat.count }}}
        {{/if}}
      </div>
    </a>
  `;
}
