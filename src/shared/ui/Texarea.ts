import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

export interface TextareaProps extends BlockOwnProps {
  fill?: boolean;
  name: string;
  placeholder?: string;
  rows?: number;
  value?: string;
}

export default class Textarea extends Block<TextareaProps> {
  static componentName = 'Textarea';

  protected template = `
  <div class="field">
    <textarea
      class="textarea {{#if fill}}textarea_fill{{/if}} {{#if error}}field__input_error{{/if}}""
      name="{{name}}"
      placeholder="{{placeholder}}"
      rows="{{rows}}"
      aria-label="{{label}}"
      ref="textarea"
    >{{value}}</textarea>
    <p class="field__error">{{error}}</p>
  </div>
  `;
}
