import type { EditPasswordRequest, EditProfileRequest } from '@/shared/models/api/user.type';
import { FormModel } from '@/shared/models/form/FormModel';
import {
  emailValidator,
  loginValidator,
  nameValidator,
  passwordValidator,
  phoneValidator,
} from '@/shared/models/form/validators';

import {
  PASSWORD_FIELDS,
  type PasswordField,
  PROFILE_FIELDS,
  type ProfileField,
  type ProfileFormErrors,
  type ProfileFormValues,
  type ProfileSnapshot,
} from '../types/profileForm.type';

export class ProfileFormModel extends FormModel<ProfileFormValues> {
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
    new_password: {
      validator: passwordValidator,
      message: '8–40 символов, минимум одна заглавная буква и одна цифра.',
    },
    old_password: {
      validator: passwordValidator,
      message: '8–40 символов, минимум одна заглавная буква и одна цифра.',
    },
  };

  constructor(
    values: ProfileFormValues,
    errors: ProfileFormErrors,
    private originalProfile: ProfileSnapshot,
  ) {
    super(values, errors);
  }

  isEditableField(field: string): field is ProfileField | PasswordField {
    return this.isProfileField(field) || this.isPasswordField(field);
  }

  isProfileField(field: string): field is ProfileField {
    return PROFILE_FIELDS.includes(field as ProfileField);
  }

  isPasswordField(field: string): field is PasswordField {
    return PASSWORD_FIELDS.includes(field as PasswordField);
  }

  hasProfileChanged(): boolean {
    return PROFILE_FIELDS.some((field) => this.hasProfileFieldChanged(field));
  }

  hasPasswordsFilled(): boolean {
    return PASSWORD_FIELDS.some((field) => this.isFilled(this.values[field]));
  }

  shouldValidateField(field: keyof ProfileFormValues): boolean {
    if (this.isProfileField(field)) {
      return this.hasProfileFieldChanged(field);
    }

    if (this.isPasswordField(field)) {
      return this.isFilled(this.values[field]);
    }

    return false;
  }

  validateProfile(): boolean {
    return PROFILE_FIELDS.map((field) => this.validateField(field)).every(Boolean);
  }

  validatePassword(): boolean {
    return PASSWORD_FIELDS.map((field) => this.validateField(field)).every(Boolean);
  }

  clearProfileErrors(): void {
    PROFILE_FIELDS.forEach((field) => this.clearFieldError(field));
  }

  clearPasswordErrors(): void {
    PASSWORD_FIELDS.forEach((field) => this.clearFieldError(field));
  }

  clearFieldError(field: keyof ProfileFormValues): void {
    this.errors[field] = undefined;
  }

  getProfileRequest(): EditProfileRequest {
    return {
      first_name: this.values.first_name,
      second_name: this.values.second_name,
      display_name: this.values.display_name,
      login: this.values.login,
      email: this.values.email,
      phone: this.values.phone,
    };
  }

  getPasswordRequest(): EditPasswordRequest {
    return {
      oldPassword: this.values.old_password,
      newPassword: this.values.new_password,
    };
  }

  private hasProfileFieldChanged(field: ProfileField): boolean {
    return (this.values[field] ?? '') !== (this.originalProfile[field] ?? '');
  }

  private isFilled(value?: string): boolean {
    return Boolean(value?.trim());
  }
}
