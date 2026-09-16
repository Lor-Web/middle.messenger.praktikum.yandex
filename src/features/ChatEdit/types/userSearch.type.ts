import type { BlockOwnProps } from '@/core/Block/Block';
import type { UserResponse } from '@/shared/models/api/user.type';

export interface UserSearchState {
  query: string;
  users: UserResponse[];
  error?: string;
  didSearch: boolean;
}

export interface UserSearchViewProps extends BlockOwnProps {
  chatId?: string;
  query?: string;
  users?: UserResponse[];
  error?: string;
  didSearch?: boolean;
  hasUsers?: boolean;
}

export interface UserSearchItemProps extends BlockOwnProps {
  user: UserResponse;
  name?: string;
}
