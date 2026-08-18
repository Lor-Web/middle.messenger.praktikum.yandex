import Block from '../core/Block/Block';

export default class AuthForm extends Block {
  static componentName = 'AuthForm';

  protected template = `
    <form class="auth__form" data-form="auth-form">
        {{{ Input label="Логин" placeholder="Логин" name='login' }}}
        {{{ Input label="Пароль" placeholder="Пароль" type='password' name='password' }}}

        <div class="auth__form-footer">
          {{{ Button label="Войти" widthFull="true" type='submit' }}}
          <p class="auth__form-description">или <a href="register">Зарегистрироваться</a></p>
        </div>
    </form>
  `;
}
