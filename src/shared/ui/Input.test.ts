import { describe, expect, it } from 'vitest';

import Input from './Input';

describe('Input', () => {
  it('рисует поле с именем, значением, плейсхолдером и ошибкой', () => {
    const input = new Input({
      name: 'login',
      label: 'Логин',
      placeholder: 'Логин',
      value: 'ivan',
      error: 'Ошибка',
      fill: true,
    });
    const root = input.element() as HTMLElement;
    const field = root.querySelector('input') as HTMLInputElement;

    expect(field.name).toBe('login');
    expect(field.type).toBe('text');
    expect(field.value).toBe('ivan');
    expect(field.placeholder).toBe('Логин');
    expect(field.getAttribute('aria-label')).toBe('Логин');
    expect(field.className).toContain('field__input_fill');
    expect(field.className).toContain('field__input_error');
    expect(root.querySelector('.error-text')?.textContent).toBe('Ошибка');
    expect(input.getRef('input')).toBe(field);
  });

  it('обновляет значение и снимает класс ошибки', () => {
    const input = new Input({
      name: 'login',
      value: 'ivan',
      error: 'Ошибка',
    });

    input.setProps({ value: 'petr', error: '' });

    const field = input.element()?.querySelector('input') as HTMLInputElement;

    expect(field.value).toBe('petr');
    expect(field.className).not.toContain('field__input_error');
  });
});
