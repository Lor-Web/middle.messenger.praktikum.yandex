/* eslint-disable @typescript-eslint/no-explicit-any */
import type Block from '../../core/Block/Block';
import type { BlockOwnProps } from '../../core/Block/Block';

export type BlockClass<Props extends BlockOwnProps = BlockOwnProps> = {
  new (props?: Props): Block<Props>;
  componentName?: string;
};

export type Route = {
  title?: string;
  path?: string;
  /*
   ** Не разобрался как не использовать any, ведь Block может быть с любыми пропсами
   ** Как будто тут логично брать any, чтобы сохранить не усложненную логику формирования Routes
   */
  block: BlockClass<any>;
  props?: Record<string, unknown>;
};

export interface ErrorRoute extends Route {
  code?: number;
}

export interface AppProps {
  title?: string;
  routes?: Route[];
  errorRoutes?: ErrorRoute[];
}
