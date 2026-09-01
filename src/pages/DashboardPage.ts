import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { Chat, ChatItem, User } from '@/shared/models/base.type';

export interface DashboardPageProps extends BlockOwnProps {
  user: User;
  chats: ChatItem[];
  chat: Chat;
}

export default class DashboardPage extends Block<DashboardPageProps> {
  protected template = `
    <main class="dashboard page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ ChatWindow chat=chat }}}
    </main>
  `;
}
