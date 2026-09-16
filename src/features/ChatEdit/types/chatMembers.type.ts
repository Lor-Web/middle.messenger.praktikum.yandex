import type { BlockOwnProps } from '@/core/Block/Block';
import type { ChatUserResponse } from '@/shared/models/api/chats.type';

import type { UserSearchListItem } from './userSearch.type';

export interface ChatMembersState {
  query: string;
  users: ChatUserResponse[];
  selectedIds: number[];
  error?: string;
  didSearch: boolean;
}

export interface ChatMembersViewProps extends BlockOwnProps {
  chatId?: string;
  query?: string;
  users?: UserSearchListItem[];
  error?: string;
  didSearch?: boolean;
  hasUsers?: boolean;
  deleteDisabled?: boolean;
}
