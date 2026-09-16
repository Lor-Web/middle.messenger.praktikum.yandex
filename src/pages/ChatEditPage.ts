import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import connect from '@/core/GlobalStore/connect';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { ChatsResponse } from '@/shared/models/api/chats.type';

export interface ChatEditPageProps extends BlockOwnProps {
  user?: UserResponse;
  chats?: ChatsResponse;
  params?: Record<string, string>;
}

class ChatEditPage extends Block<ChatEditPageProps> {
  protected template = `
    <main class="dashboard page">
      {{{ Sidebar user=user chats=chats }}}
      {{{ ChatEditView user=user chats=chats chatId=params.id }}}
    </main>
  `;
}

export default connect<ChatEditPageProps>((state) => ({
  user: state.user as UserResponse | undefined,
  chats: state.chats as ChatsResponse | undefined,
}))(ChatEditPage);
