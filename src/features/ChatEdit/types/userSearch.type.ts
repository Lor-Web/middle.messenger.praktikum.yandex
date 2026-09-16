import type { BlockOwnProps } from '@/core/Block/Block';
import type { UserResponse } from '@/shared/models/api/user.type';

export interface UserSearchListItem {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  avatar: string;
  selected?: boolean;
  isCurrent?: boolean;
}

export interface UserSearchState {
  query: string;
  users: UserResponse[];
  selectedIds: number[];
  error?: string;
  didSearch: boolean;
}

export interface UserSearchViewProps extends BlockOwnProps {
  chatId?: string;
  query?: string;
  users?: UserSearchListItem[];
  error?: string;
  didSearch?: boolean;
  hasUsers?: boolean;
  addDisabled?: boolean;
}

export interface UserSearchItemProps extends BlockOwnProps {
  user: UserSearchListItem;
  name?: string;
  selected?: boolean;
  isCurrent?: boolean;
  actionLabel?: string;
  selectVariant?: 'primary' | 'transparent';
}
