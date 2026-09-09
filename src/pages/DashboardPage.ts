import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import GlobalStore from '@/core/GlobalStore/GlobalStore';
import AuthApi from '@/shared/api/AuthApi';
import ChatsApi from '@/shared/api/ChatsApi';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { ChatsResponse } from '@/shared/models/api/chats.type';
import type { Chat } from '@/shared/models/base.type';

export interface DashboardPageProps extends BlockOwnProps {
  user: UserResponse;
  chats: ChatsResponse;
  chat: Chat;
}

export default class DashboardPage extends Block<DashboardPageProps> {
  private _authApi = new AuthApi();
  private _chatsApi = new ChatsApi();
  private _globalStore = GlobalStore;

  constructor() {
    super();

    this._authApi
      .user()
      .then((user) => {
        this._globalStore.setState('user', user);
        this.setProps({ ...this.props, user });
      })
      .catch((e) => console.log('ERROR', e));

    this._chatsApi.chats({}).then((chats) => {
      this.setProps({ ...this.props, chats });
    });
  }

  protected componentDidMount(): void {
    console.log(this.props);
  }

  protected template = `
    <main class="dashboard page">
      {{{ Sidebar user=user chats=chats }}}
      
      <div class="dashboard-window">
        <p>Выберите или создайте чат чтобы отправить сообщение</p>
        {{{ DashboardFormView }}}
      </div>
    </main>
  `;
}
