import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat, ChatsResponse } from '@/shared/models/api/chats.type';

export interface DashboardPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  chat?: Chat;
  params?: Record<string, string>;
}

class DashboardPage extends Block<DashboardPageProps> {
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

export default connect<DashboardPageProps>((state) => ({
  user: state.user as UserResponse | undefined,
  chats: state.chats as ChatsResponse | undefined,
}))(DashboardPage);
