import Block, { type BlockOwnProps } from '../core/Block/Block';
import type { User } from '../shared/models/base.type';

export interface ProfileFormProps extends BlockOwnProps {
  user: User;
}

export default class ProfileForm extends Block<ProfileFormProps> {
  static componentName = 'ProfileForm';

  protected template = `
    <form class="profile__data-form">
      {{{ Input type='file' label="Загрузить аватар" placeholder="Загрузить аватар" name='avatar' }}}
      {{{ Input label="Имя" placeholder="Имя" value=user.firstName name='first_name' }}}
      {{{ Input label="Фамилия" placeholder="Фамилия" value=user.secondName name='second_name' }}}
      {{{ Input label="Имя в чате" placeholder="Имя в чате" value=user.displayName name='display_name' }}}
      {{{ Input label="Логин" placeholder="Логин" value=user.login name='login' }}}
      {{{ Input label="Почта" placeholder="Почта" value=user.email name='email' }}}
      {{{ Input label="Телефон" placeholder="Телефон" value=user.phone name='phone' }}}
      {{{ Input type='password' label="Пароль" placeholder="Пароль" name='old_password' }}}
      {{{ Input type='password' label="Новый пароль" placeholder="Новый пароль" name='new_password' }}}
      
      {{{ Button label="Сохранить" type='submit' }}}
    </form>
  `;
}
