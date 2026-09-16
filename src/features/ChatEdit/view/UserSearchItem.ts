import Block from '@/core/Block/Block';

import type { UserSearchItemProps } from '../types/userSearch.type';

export default class UserSearchItem extends Block<UserSearchItemProps> {
  static componentName = 'UserSearchItem';

  constructor(props: UserSearchItemProps) {
    const user = props.user;
    const fullName = [user?.first_name, user?.second_name].filter(Boolean).join(' ');
    const selected = Boolean(props.selected ?? user?.selected);

    super({
      ...props,
      selected,
      name: user?.display_name || fullName || user?.login,
      actionLabel: selected ? 'Отменить выбор' : 'Выбрать пользователя',
    });
  }

  public getUserId(): number | undefined {
    return this.props.user?.id;
  }

  protected template = `
    <li class="user-search__item {{#if selected}}user-search__item_selected{{/if}}">
      {{{ Avatar src=user.avatar alt=name size='medium' }}}

      <p class="user-search__name">{{name}}</p>

      {{{ Button label=actionLabel type="button" ref="selectBtn" size="small" transparent=selected }}}
    </li>
  `;
}
