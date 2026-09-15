import type Block from '@/core/Block/Block';
import type { BlockOwnProps } from '@/core/Block/Block';
import { render } from '@/shared/lib/utility';
import type { Route as RouteType, RouteAccess } from '@/shared/models/app.type';

import { matchPath, type PathMatch, type PathParams, rankPath } from './path';

export default class Route {
  private _pathname: string;
  private _blockClass: RouteType['block'] | null;
  private _block: Block<BlockOwnProps> | null;
  private _access: RouteAccess;
  private _title?: string;
  private _props;

  constructor({ path, block, props, access = 'protected', title }: RouteType & { path: string }) {
    this._pathname = path;
    this._blockClass = block ?? null;
    this._block = null;
    this._access = access;
    this._title = title;
    this._props = props;
  }

  get pathname() {
    return this._pathname;
  }

  get access() {
    return this._access;
  }

  get rank() {
    return rankPath(this._pathname);
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): PathMatch | null {
    return matchPath(this._pathname, pathname);
  }

  render(params: PathParams = {}) {
    if (this._title) {
      document.title = this._title;
    }

    const props = { ...this._props, params };

    if (!this._block && this._blockClass) {
      this._block = new this._blockClass(props);
      render({ block: this._block });
      return;
    }

    this._block?.setProps(props as BlockOwnProps);
    this._block?.show();
  }
}
