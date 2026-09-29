import { describe, expect, it } from 'vitest';

import Button from './Button';

describe('Button', () => {
  it('рисует кнопку с подписью, типом и вариантом', () => {
    const button = new Button({ label: 'Сохранить', type: 'submit' });
    const element = button.element() as HTMLButtonElement;

    expect(element.tagName).toBe('BUTTON');
    expect(element.type).toBe('submit');
    expect(element.textContent).toContain('Сохранить');
    expect(element.className).toContain('button_variant_primary');
  });

  it('рисует ссылку, если передан link', () => {
    const button = new Button({ link: true, label: 'Назад', href: '/messenger' });
    const element = button.element();

    expect(element?.tagName).toBe('A');
    expect(element?.textContent).toContain('Назад');
  });
});
