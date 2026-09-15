import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat, ChatsResponse } from '@/shared/models/api/chats.type';

export interface SettingsPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  chat?: Chat;
}

class SettingsPage extends Block<SettingsPageProps> {
  protected template = `
    <main class="settings page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ Profile user=user }}}
    </main>
  `;
}

export default connect<SettingsPageProps>((state) => ({
  user: state.user as UserResponse | undefined,
  chats: state.chats as ChatsResponse | undefined,
}))(SettingsPage);
