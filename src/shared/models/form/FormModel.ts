import type { FormErrors, FormRule } from './form.type';

export abstract class FormModel<T extends Record<string, string>> {
  protected values: T;
  protected errors: FormErrors<T> = {};

  protected abstract rules: Partial<Record<keyof T, FormRule>>;

  protected initialValues: T;

  constructor(initialValues: T, errors: FormErrors<T>) {
    this.initialValues = { ...initialValues };
    this.values = { ...initialValues };
    this.errors = { ...errors };
  }

  setValue(field: keyof T, value: string): void {
    this.values = {
      ...this.values,
      [field]: value,
    };
  }

  getValues(): T {
    return this.values;
  }

  getErrors(): FormErrors<T> {
    return this.errors;
  }

  validateField(field: keyof T): boolean {
    const rule = this.rules[field];

    if (!rule) {
      return true;
    }

    const isValid = rule.validator(this.values[field]);

    this.errors[field] = isValid ? undefined : rule.message;

    return isValid;
  }

  validate(): boolean {
    return (Object.keys(this.rules) as Array<keyof T>)
      .map((field) => this.validateField(field))
      .every(Boolean);
  }
}
