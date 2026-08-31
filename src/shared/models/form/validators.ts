export const loginValidator = (value: string): boolean => {
  if (!value) return false;
  return /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/.test(value);
};

export const passwordValidator = (value: string): boolean => {
  if (!value) return false;
  return /^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value);
};

export function nameValidator(value: string): boolean {
  if (!value) return false;
  return /^[A-ZА-ЯЁ][a-zа-яё-]*$/.test(value);
}

export function emailValidator(value: string): boolean {
  if (!value) return false;
  return /^[A-Za-z0-9._-]+@[A-Za-z]+\.[A-Za-z]+$/.test(value);
}

export function phoneValidator(value: string): boolean {
  if (!value) return false;
  return /^\+?\d{10,15}$/.test(value);
}

export function messageValidator(value: string): boolean {
  return value ? true : false;
}
