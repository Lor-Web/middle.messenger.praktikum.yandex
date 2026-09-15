import type { FormErrors } from '@/shared/models/form/form.type';

export const PROFILE_FIELDS = [
  'first_name',
  'second_name',
  'display_name',
  'login',
  'email',
  'phone',
] as const;

export const PASSWORD_FIELDS = ['old_password', 'new_password'] as const;

export type ProfileField = (typeof PROFILE_FIELDS)[number];
export type PasswordField = (typeof PASSWORD_FIELDS)[number];

export type ProfileFormValues = {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  old_password: string;
  new_password: string;
};

export type ProfileFormErrors = FormErrors<ProfileFormValues> & {
  editProfile?: string;
  editPassword?: string;
};

export type ProfileSnapshot = Pick<ProfileFormValues, ProfileField>;
