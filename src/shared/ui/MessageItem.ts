import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

import type { Message } from '../models/base.type';

export interface MessageItemProps extends BlockOwnProps {
  message: Message;
}

export default class MessageItem extends Block<MessageItemProps> {
  static componentName = 'MessageItem';

  protected template = `
    <div class="message-item {{#if (authorMessage message.senderId)}}message-item_author{{/if}}">
      {{#unless (authorMessage message.senderId)}}
        {{{ Avatar src=message.senderAvatar alt=message.senderName size='small' }}}
      {{/unless}}

      <div class="message-item__content">
        {{#unless (authorMessage message.senderId)}}
          {{#if message.senderName}}
            <p class="message-item__name">{{message.senderName}}</p>
          {{/if}}
        {{/unless}}

        <div class="message-item__value message-item__value_{{message.message.type}}">
          {{#if (messageTypeText message.message.type)}}
            <p class="message-item__value-text">{{message.message.value}}</p>
          {{else}}
            <img
              class="message-item__value-image"
              src="{{message.message.value}}"
              alt='message-image'
            />
          {{/if}}
        </div>
      </div>

      <p class="message-item__date">
        {{formatDate message.timestamp}}
      </p>

      {{#if message.reading}}
        <div class="message-item__read-status">
          {{{ Icon name="check-double" }}}
        </div>
      {{/if}}
    </div>
  `;
}
