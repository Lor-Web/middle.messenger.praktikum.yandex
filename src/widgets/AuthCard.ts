import Block from '../core/Block/Block';

export default class AuthCard extends Block {
  static componentName = 'AuthCard';

  protected template = `
    <div class="card">
      <h1 class="card__title">
        Войти
      </h1>
  
      {{{ AuthForm }}}
    </div>
  `;
}
