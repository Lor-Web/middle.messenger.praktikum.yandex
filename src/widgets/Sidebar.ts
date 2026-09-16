import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import GlobalStore from '@/core/GlobalStore/GlobalStore';
import Router from '@/core/Router/Router';
import AuthApi from '@/shared/api/AuthApi';
import { AUTH_PATH, SETTINGS_PATH } from '@/shared/constants/paths.constant';
import { listenerForChild } from '@/shared/lib/setListenerForChild';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat } from '@/shared/models/api/chats.type';

export interface SidebarProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: Chat[];
}

export default class Sidebar extends Block<SidebarProps> {
  static componentName = 'Sidebar';

  private _router = new Router();
  private _authApi = new AuthApi();

  protected componentDidMount(): void {
    const logoutBtn = this.getRef('logoutBtn');

    if (logoutBtn instanceof HTMLAnchorElement) {
      listenerForChild.set({
        element: logoutBtn,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._authApi.logout().then(() => {
            GlobalStore.reset();
            this._router.go(AUTH_PATH);
          });
        },
      });
    }
  }

  protected componentWillUnmount(): void {
    const logoutBtn = this.getRef('logoutBtn');

    if (logoutBtn instanceof HTMLAnchorElement) {
      listenerForChild.remove({
        element: logoutBtn,
        eventName: 'click',
        eventCallback: (e: Event) => {
          e.preventDefault();
          this._authApi.logout().then(() => {
            GlobalStore.reset();
            this._router.go(AUTH_PATH);
          });
        },
      });
    }
  }

  protected template = `
    <aside class="sidebar">
      <header class="sidebar__header">
        <div class="sidebar__header-top">
          {{{ Avatar src=user.avatar alt=user.first_name size='medium' }}}

          <h3 class="sidebar__header-title">{{user.first_name}}</h3>

          {{{ Button link=true href='${SETTINGS_PATH}' icon='gear' transparent=true }}}
          {{{ Button link=true icon='logout' transparent=true ref='logoutBtn' }}}
        </div>

        {{{ Input placeholder="Поиск" fill="true" name='search' }}}
      </header>

      <nav class="sidebar__chat-list">
        {{#each chats}}
          {{{ ChatItem chat=this }}}
        {{/each}}
      </nav>
    </aside>
  `;
}
