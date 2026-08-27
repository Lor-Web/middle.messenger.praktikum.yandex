import Block, { type BlockOwnProps } from '../core/Block/Block';
import type { User } from '../shared/models/base.type';

export interface ProfileProps extends BlockOwnProps {
  user: User;
}

export default class Profile extends Block {
  static componentName = 'Profile';

  protected template = `
    <div class="profile">
      <header class="profile__header">
        <h3 class="profile__header-title">Профиль</h3>
      </header>

      <section class="profile__data">
        <img
          class="avatar avatar_large"
          src="{{ user.avatar }}"
        />

        {{{ ProfileFormView user=user }}}
      </section>
    </div>
  `;
}
