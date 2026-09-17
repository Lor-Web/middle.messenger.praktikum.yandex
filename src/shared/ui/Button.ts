import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import Router from '@/core/Router/Router';

export interface ButtonProps extends BlockOwnProps {
  link?: boolean;
  href?: string;
  type?: HTMLButtonElement['type'];
  widthFull?: boolean;
  icon?: string;
  disabled?: boolean;
  label?: string;
  size?: 'small';
  variant?: 'primary' | 'delete' | 'transparent';
}

export default class Button extends Block<ButtonProps> {
  static componentName = 'Button';

  private _router = new Router();

  constructor(props: ButtonProps = {} as ButtonProps) {
    super({
      variant: 'primary',
      ...props,
    });
  }

  protected events = {
    click: (e: Event) => {
      if (this.props.href) {
        e.preventDefault();
        this._router.go(this.props.href);
      }
    },
  };

  protected template = `
    {{#if link}}
      <a 
        class="
          button 
          {{#if widthFull}}button_width_full{{/if}} 
          {{#if icon}}button_icon{{/if}}
          {{#if size}}button_size_{{size}}{{/if}}
          {{#if variant}}button_variant_{{variant}}{{/if}}
        " 
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
          {{#if size}}button_size_{{size}}{{/if}}
          {{#if variant}}button_variant_{{variant}}{{/if}}
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
