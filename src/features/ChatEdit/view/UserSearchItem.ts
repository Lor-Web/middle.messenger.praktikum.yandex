import Block from '@/core/Block/Block';

import type { UserSearchItemProps } from '../types/userSearch.type';

export default class UserSearchItem extends Block<UserSearchItemProps> {
  static componentName = 'UserSearchItem';

  constructor(props: UserSearchItemProps) {
    const user = props.user;
    const fullName = [user?.first_name, user?.second_name].filter(Boolean).join(' ');

    super({
      ...props,
      name: user?.display_name || fullName || user?.login,
    });
  }

  public getUserId(): number | undefined {
    return this.props.user?.id;
  }

  protected template = `
    <li class="user-search__item">
      {{{ Avatar src=user.avatar alt=name size='medium' }}}

      <p class="user-search__name">{{name}}</p>

      {{{ Button label='Добавить в чат' ref='addBtn' size='small' }}}
    </li>
  `;
}
