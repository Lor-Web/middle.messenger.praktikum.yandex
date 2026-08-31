import Block from '../core/Block/Block';

export default class AuthPage extends Block {
  protected template = `
    <main class="auth page">
      {{{ AuthCard }}}
    </main>
  `;
}
