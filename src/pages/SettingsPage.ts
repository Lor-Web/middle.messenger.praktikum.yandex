import Block, { type BlockOwnProps } from '../core/Block/Block';
import type { ChatItem, User } from '../shared/models/base.type';

export interface SettingsPageProps extends BlockOwnProps {
  user: User;
  chats: ChatItem[];
}

export default class SettingsPage extends Block {
  protected template = `
    <main class="settings page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ Profile user=user }}}
    </main>
  `;
}
