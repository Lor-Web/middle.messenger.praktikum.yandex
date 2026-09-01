import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

export interface ButtonProps extends BlockOwnProps {
  link?: boolean;
  href?: string;
  type?: HTMLButtonElement['type'];
  widthFull?: boolean;
  icon?: string;
  transparent?: boolean;
  disabled?: boolean;
}

export default class Button extends Block<ButtonProps> {
  static componentName = 'Button';

  protected template = `
    {{#if link}}
      <a 
        class="
          button 
          {{#if widthFull}}button_width_full{{/if}} 
          {{#if icon}}button_icon{{/if}}
          {{#if transparent}}button_transparent{{/if}}
        " 
        href="{{href}}"
        {{#if disabled}}disabled{{/if}}
      >
        {{#if icon}}
          {{{ Icon name=icon }}}
        {{/if}}
  
        {{label}}
      </a>

    {{else}}
      <button 
        class="
          button 
          {{#if widthFull}}button_width_full{{/if}} 
          {{#if icon}}button_icon{{/if}}
          {{#if transparent}}button_transparent{{/if}}
        " 
        type="{{#if type}}{{type}}{{else}}button{{/if}}"
        {{#if disabled}}disabled{{/if}}
        ref="button"
      >
        {{#if icon}}
          {{{ Icon name=icon }}}
        {{/if}}
  
        {{label}}
      </button>    
    {{/if}}
  `;
}
