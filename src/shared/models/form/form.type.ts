export interface Form {
  value?: Record<string, string>;
  errors?: Record<string, string | undefined>;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface FormRule {
  validator: (value: string) => boolean;
  message: string;
}
