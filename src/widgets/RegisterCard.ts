import Block from '../core/Block/Block';

export default class RegisterCard extends Block {
  static componentName = 'RegisterCard';

  protected template = `
    <div class="card">
      <h1 class="card__title">
        Регистрация
      </h1>
  
      {{{ RegisterForm }}}
    </div>
  `;
}
