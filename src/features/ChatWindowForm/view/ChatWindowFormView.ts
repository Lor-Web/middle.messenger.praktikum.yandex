import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { FormErrors } from '@/shared/models/form/form.type';

import ChatWindowFormController from '../controller/ChatWindowFormController';
import { ChatWindowFormModel } from '../models/ChatWindowFormModel';
import type { ChatWindowFormModelValues } from '../types/chatWindowFormModel.type';

export interface ChatWindowFormProps extends BlockOwnProps {
  values: ChatWindowFormModelValues;
  errors: FormErrors<ChatWindowFormModelValues>;
}

export default class ChatWindowFormView extends Block<ChatWindowFormProps> {
  static componentName = 'ChatWindowFormView';

  protected componentDidMount(): void {
    const model = new ChatWindowFormModel(this.props.values, this.props.errors);
    const controller = new ChatWindowFormController(model, this);

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
