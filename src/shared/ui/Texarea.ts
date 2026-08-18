import type { BlockOwnProps } from '../../core/Block/Block';
import Block from '../../core/Block/Block';

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
    <textarea
      class="textarea {{#if fill}}textarea_fill{{/if}}"
      name="{{name}}"
      placeholder="{{placeholder}}"
      rows="{{rows}}"
    >
      {{value}}
    </textarea>
  `;
}
