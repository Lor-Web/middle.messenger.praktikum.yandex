import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
import GlobalStore from '@/core/GlobalStore/GlobalStore';
import AuthApi from '@/shared/api/AuthApi';
import ChatsApi from '@/shared/api/ChatsApi';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { ChatsResponse } from '@/shared/models/api/chats.type';

export interface ChatPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  params?: Record<string, string>;
}

class ChatPage extends Block<ChatPageProps> {
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
    <main class="dashboard page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ ChatWindow chats=chats chatId=params.id }}}
    </main>
  `;
}

export default connect<ChatPageProps>((state) => ({
  user: state.user as UserResponse | undefined,
  chats: state.chats as ChatsResponse | undefined,
}))(ChatPage);
