import type { BlockOwnProps } from '@/core/Block/Block';
import type { UserResponse } from '@/shared/models/api/auth.type';
import type { Chat } from '@/shared/models/api/chats.type';

export interface ChatEditViewProps extends BlockOwnProps {
  user?: UserResponse;
  chat?: Chat;
  chats?: Chat[];
  chatId?: string;
  backHref?: string;
  error?: string;
  deleteChatDisabled?: boolean;
}
