export type Rule = {
  validator: (value: string) => boolean;
  message?: string;
};

export const formValidator = (fields: Record<string, unknown>, rules: Record<string, Rule>) => {
  const result: Record<string, string> = {};

  for (const key in fields) {
    if (rules[key] && !rules[key].validator((fields[key] as HTMLInputElement).value as string)) {
      result[key] = rules[key]?.message ?? 'Поле не прошло проверку валидации';
    }
  }

  return { errors: result };
};
