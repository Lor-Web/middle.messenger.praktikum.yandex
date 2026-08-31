import Block, { type BlockOwnProps } from '../core/Block/Block';
import type { ChatItem, User } from '../shared/models/base.type';

export interface SidebarProps extends BlockOwnProps {
  user: User;
  chats: ChatItem[];
}

export default class Sidebar extends Block<SidebarProps> {
  static componentName = 'Sidebar';

  protected template = `
    <aside class="sidebar">
      <header class="sidebar__header">
        <div class="sidebar__header-top">
          <img
            class="avatar avatar_medium"
            src="{{ user.avatar }}"
            alt="{{ user.displayName }}"
          />

          <h3 class="sidebar__header-title">{{user.displayName}}</h3>

          {{{ Button link=true href='/settings' icon='gear' transparent=true }}}
          {{{ Button link=true href='/' icon='logout' transparent=true }}}
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
