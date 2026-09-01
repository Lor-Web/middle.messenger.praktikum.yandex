import Block, { type BlockOwnProps } from '@/core/Block/Block';
import type { FormErrors } from '@/shared/models/form/form.type';

import AuthFormController from '../controller/AuthFormController';
import { AuthFormModel } from '../models/AuthFormModel';
import type { AuthFormValues } from '../types/authForm.type';

export interface AuthFormProps extends BlockOwnProps {
  values: AuthFormValues;
  errors: FormErrors<AuthFormValues>;
}

export default class AuthFormView extends Block<AuthFormProps> {
  static componentName = 'AuthForm';

  protected componentDidMount(): void {
    const model = new AuthFormModel(this.props.values, this.props.errors);
    const controller = new AuthFormController(model, this);

    controller.init();
  }

  protected template = `
    <form class="auth__form" data-form="auth-form" ref="authForm">
        {{{ Input label="Логин" placeholder="Логин" name='login' ref="login" value=values.login error=errors.login }}}
        {{{ Input 
          label="Пароль" 
          placeholder="Пароль" 
          type='password' 
          name='password' 
          ref='password' 
          value=values.password
          error=errors.password
        }}}

        <div class="auth__form-footer">
          {{{ Button label="Войти" widthFull="true" type='submit' }}}
          <p class="auth__form-description">или <a href="register">Зарегистрироваться</a></p>
        </div>
    </form>
  `;
}
