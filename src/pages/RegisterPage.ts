import Block from '@/core/Block/Block';

export default class RegisterPage extends Block {
  protected template = `
    <main class="auth page">
      {{{ RegisterCard }}}
    </main>
  `;
}
