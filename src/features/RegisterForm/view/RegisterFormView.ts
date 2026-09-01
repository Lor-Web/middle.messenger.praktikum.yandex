import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';
import type { FormErrors } from '@/shared/models/form/form.type';

import RegisterFormController from '../controller/RegisterFormController';
import { RegisterFormModel } from '../models/RegisterFormModel';
import type { RegisterFormValues } from '../types/registerForm.type';

export interface RegisterFormProps extends BlockOwnProps {
  values: RegisterFormValues;
  errors: FormErrors<RegisterFormValues>;
}

export default class RegisterFormView extends Block<RegisterFormProps> {
  static componentName = 'RegisterFormView';

  protected componentDidMount(): void {
    const model = new RegisterFormModel(this.props.values, this.props.errors);
    const controller = new RegisterFormController(model, this);

    controller.init();
  }

  protected template = `
    <form class="auth__form" data-form="auth-form" ref="registerForm">
        {{{ Input label="Логин" placeholder="Логин" name='login' value=values.login error=errors.login }}}
        {{{ Input label="Почта" placeholder="Почта" name='email' value=values.email error=errors.email }}}
        {{{ Input label="Имя" placeholder="Имя" name='first_name' value=values.first_name error=errors.first_name }}}
        {{{ Input 
          label="Фамилия" 
          placeholder="Фамилия" 
          name='second_name' 
          value=values.second_name 
          error=errors.second_name 
        }}}
        {{{ Input label="Телефон" placeholder="Телефон" name='phone' value=values.phone error=errors.phone }}}
        {{{ Input 
          label="Пароль" 
          placeholder="Пароль" 
          type='password' 
          name='password' 
          value=values.password 
          error=errors.password 
        }}}

        <div class="auth__form-footer">
          {{{ Button label="Зарегистрироваться" widthFull="true" type='submit' }}}
          <p class="auth__form-description">или <a href="auth">Войти</a></p>
        </div>
    </form>
  `;
}
