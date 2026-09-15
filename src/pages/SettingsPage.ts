import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import GlobalStore from '@/core/GlobalStore/GlobalStore';
import AuthApi from '@/shared/api/AuthApi';
import ChatsApi from '@/shared/api/ChatsApi';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat, ChatsResponse } from '@/shared/models/api/chats.type';

export interface SettingsPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  chat?: Chat;
}

export default class SettingsPage extends Block<SettingsPageProps> {
  private _authApi = new AuthApi();
  private _chatsApi = new ChatsApi();
  private _globalStore = GlobalStore;

  constructor(props?: SettingsPageProps) {
    super(props);

    this._authApi.user().then((user) => {
      this._globalStore.setState('user', user);
      this.setProps({ ...this.props, user });
    });

    this._chatsApi.chats({}).then((chats) => {
      this.setProps({ ...this.props, chats });
    });
  }

  protected template = `
    <main class="settings page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ Profile user=user }}}
    </main>
  `;
}
