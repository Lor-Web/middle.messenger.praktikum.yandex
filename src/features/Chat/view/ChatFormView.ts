import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { FormErrors } from '@/shared/models/form/form.type';

import ChatFormController from '../controller/ChatFormController';
import { ChatFormModel } from '../models/ChatFormModel';
import type { ChatFormValues } from '../types/chatForm.type';

export interface ChatFormProps extends BlockOwnProps {
  values: ChatFormValues;
  errors: FormErrors<ChatFormValues>;
}

export default class ChatFormView extends Block<ChatFormProps> {
  static componentName = 'ChatFormView';

  protected componentDidMount(): void {
    const model = new ChatFormModel(this.props.values, this.props.errors);
    const controller = new ChatFormController(model, this);

    controller.init();
  }

  protected template = `
    <form class="chat-window__form" ref="chatForm">
      {{{ Button icon='paperclip' transparent=true }}}

      {{{ Textarea placeholder='Сообщение...' name='message' value=values.message error=errors.message  }}}

      {{{ Button type='submit' icon='arrow-right' }}}
    </form>
  `;
}
