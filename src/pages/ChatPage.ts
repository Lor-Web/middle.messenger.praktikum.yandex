import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { ChatsResponse } from '@/shared/models/api/chats.type';

export interface ChatPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  params?: Record<string, string>;
}

class ChatPage extends Block<ChatPageProps> {
  protected template = `
    <main class="dashboard page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ ChatView chats=chats chatId=params.id }}}
    </main>
  `;
}

export default connect<ChatPageProps>((state) => ({
  user: state.user as UserResponse | undefined,
  chats: state.chats as ChatsResponse | undefined,
}))(ChatPage);
