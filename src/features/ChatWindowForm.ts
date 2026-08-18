import Block from '../core/Block/Block';

export default class ChatWindowForm extends Block {
  static componentName = 'ChatWindowForm';

  protected template = `
    <form class="chat-window__form">
      {{{ Button icon='paperclip' transparent=true }}}

      {{{ Textarea placeholder='Сообщение...' name='message' }}}

      {{{ Button type='submit' icon='arrow-right' }}}
    </form>
  `;
}
