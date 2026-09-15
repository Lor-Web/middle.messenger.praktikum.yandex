import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
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

class SettingsPage extends Block<SettingsPageProps> {
  private _authApi = new AuthApi();
  private _chatsApi = new ChatsApi();
  private _userRequest: Promise<unknown> | null = null;
  private _chatsRequest: Promise<unknown> | null = null;

  protected componentDidMount(): void {
    if (!GlobalStore.getState('user') && !this._userRequest) {
      this._userRequest = this._authApi
        .user()
        .then((user) => GlobalStore.setState('user', user))
        .finally(() => {
          this._userRequest = null;
        });
    }

    if (!GlobalStore.getState('chats') && !this._chatsRequest) {
      this._chatsRequest = this._chatsApi
        .chats({})
        .then((chats) => GlobalStore.setState('chats', chats))
        .finally(() => {
          this._chatsRequest = null;
        });
    }
  }

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
