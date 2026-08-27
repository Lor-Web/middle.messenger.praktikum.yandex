import Handlebars, { type HelperOptions } from 'handlebars';

import type Block from '../Block/Block';
import type { BlockOwnProps } from '../Block/Block';

export type ComponentClass<Props extends BlockOwnProps> = {
  new (props: Props): Block<Props>;
  componentName: string;
};

/** Уникальный инкрементальный идентификатор для заглушки */
let uniqueId = 0;

export default function registerComponent<Props extends BlockOwnProps>(
  Component: ComponentClass<Props>,
) {
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;
      const component = new Component(hash as Props);

      /** Если в свойствах компонента есть ссылка, сохраним её в свойство класса */
      if ('ref' in hash) {
        (data.root.__refs = data.root.__refs || {})[hash.ref] = component.element();
      }

      (data.root.__children = data.root.__children || []).push({
        component,
        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);
          if (!placeholder) {
            throw new Error(`Can't find data-id for component ${Component.componentName}`);
          }

          const element = component.element();

          if (!element) {
            throw new Error(`Can't render component ${Component.componentName}`);
          }

          placeholder.replaceWith(element);
        },
      });

      return `<div ${dataAttribute}></div>`;
    },
  );
}
