import type Block from '@/core/Block/Block';
import type { BlockOwnProps } from '@/core/Block/Block';
import { isEqualStr, render } from '@/shared/lib/utility';
import type { Route as RouteType } from '@/shared/models/app.type';

export default class Route {
  private _pathname;
  private _blockClass: RouteType['block'] | null;
  private _block: Block<BlockOwnProps> | null;
  private _props;

  constructor({ path, block, props }: Partial<RouteType>) {
    this._pathname = path;
    this._blockClass = block ?? null;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return isEqualStr(pathname, this._pathname);
  }

  render() {
    if (!this._block && this._blockClass) {
      this._block = new this._blockClass(this._props);
      render({ block: this._block });
      return;
    }

    this._block?.show();
  }
}
