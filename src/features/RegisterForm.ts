import Block from '../core/Block/Block';

export default class RegisterForm extends Block {
  static componentName = 'RegisterForm';

  protected template = `
    <form class="auth__form" data-form="auth-form">
        {{{ Input label="Логин" placeholder="Логин" name='login' }}}
        {{{ Input label="Почта" placeholder="Почта" name='email' }}}
        {{{ Input label="Имя" placeholder="Имя" name='first_name' }}}
        {{{ Input label="Фамилия" placeholder="Фамилия" name='second_name' }}}
        {{{ Input label="Телефон" placeholder="Телефон" name='phone' }}}
        {{{ Input label="Пароль" placeholder="Пароль" type='password' name='password' }}}

        <div class="auth__form-footer">
          {{{ Button label="Зарегистрироваться" widthFull="true" type='submit' }}}
          <p class="auth__form-description">или <a href="auth">Войти</a></p>
        </div>
    </form>
  `;
}
