import type { FormErrors } from '../../../shared/models/form/form.type';
import { FormModel } from '../../../shared/models/form/FormModel';
import {
  emailValidator,
  loginValidator,
  nameValidator,
  passwordValidator,
  phoneValidator,
} from '../../../shared/models/form/validators';
import type { RegisterFormValues } from '../types/registerForm.type';

export class RegisterFormModel extends FormModel<RegisterFormValues> {
  protected rules = {
    login: {
      validator: loginValidator,
      message: '3–20 символов, латиница. Может содержать цифры, но не состоит только из них.',
    },
    email: {
      validator: emailValidator,
      message: 'Некорректная почта.',
    },
    first_name: {
      validator: nameValidator,
      message: 'Латиница или кириллица, первая буква заглавная.',
    },
    second_name: {
      validator: nameValidator,
      message: 'Латиница или кириллица, первая буква заглавная.',
    },
    phone: {
      validator: phoneValidator,
      message: '10–15 символов, цифры, может начинаться с плюса.',
    },
    password: {
      validator: passwordValidator,
      message: '8–40 символов, минимум одна заглавная буква и одна цифра.',
    },
  };

  constructor(values: RegisterFormValues, errors: FormErrors<RegisterFormValues>) {
    super(values, errors);
  }
}
