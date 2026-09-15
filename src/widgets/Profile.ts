import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { UserResponse } from '@/shared/models/api/auth.type';

export interface ProfileProps extends BlockOwnProps {
  user: UserResponse;
}

export default class Profile extends Block {
  static componentName = 'Profile';

  protected template = `
    <div class="profile">
      <header class="profile__header">
        <h3 class="profile__header-title">Профиль</h3>
      </header>

      <section class="profile__data">
        {{{ Avatar src=user.avatar alt=user.first_name size='large' }}}
        {{{ ProfileFormView user=user }}}
      </section>
    </div>
  `;
}
