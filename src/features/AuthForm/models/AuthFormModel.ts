import type { FormErrors } from '../../../shared/models/form/form.type';
import { FormModel } from '../../../shared/models/form/FormModel';
import { loginValidator, passwordValidator } from '../../../shared/models/form/validators';
import type { AuthFormValues } from '../types/authForm.type';

export class AuthFormModel extends FormModel<AuthFormValues> {
  protected rules = {
    login: {
      validator: loginValidator,
      message: '3–20 символов, латиница. Может содержать цифры, но не состоит только из них.',
    },
    password: {
      validator: passwordValidator,
      message: '8–40 символов, минимум одна заглавная буква и одна цифра.',
    },
  };

  constructor(values: AuthFormValues, errors: FormErrors<AuthFormValues>) {
    super(values, errors);
  }
}
