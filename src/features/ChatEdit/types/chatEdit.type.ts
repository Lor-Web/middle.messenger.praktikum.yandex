import type { BlockOwnProps } from '@/core/Block/Block';
import type { Chat } from '@/shared/models/api/chats.type';

export interface ChatEditViewProps extends BlockOwnProps {
  chat?: Chat;
  chats?: Chat[];
  chatId?: string;
  backHref?: string;
}
