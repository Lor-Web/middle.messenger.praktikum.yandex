import Block, { type BlockOwnProps } from '../../core/Block/Block';

export interface InputProps extends BlockOwnProps {
  name: string;
  label?: string;
  fill?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: string;
}

export default class Input extends Block<InputProps> {
  static componentName = 'Input';

  protected template = `
    <div class="field">
      <label for="{{name}}" class="field__label">
        {{label}}
      </label>
      <input 
        class="field__input {{#if fill}}field__input_fill{{/if}}" 
        type="{{#if type}}{{type}}{{else}}text{{/if}}" 
        name="{{name}}" 
        placeholder="{{placeholder}}" 
        value="{{value}}"
        aria-label={{label}}
      />
      <p class="field__error">{{error}}</p>
    </div>
  `;
}
