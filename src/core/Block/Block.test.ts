import { beforeEach, describe, expect, it } from 'vitest';

import Block, { type BlockOwnProps } from './Block';

interface LifeProps extends BlockOwnProps {
  label: string;
}

class LifeBlock extends Block<LifeProps> {
  mounts = 0;
  unmounts = 0;
  clicks = 0;

  protected template = `<button type="button" ref="action">{{label}}</button>`;

  protected events = {
    click: () => {
      this.clicks += 1;
    },
  };

  protected componentDidMount() {
    this.mounts += 1;
  }

  protected componentWillUnmount() {
    this.unmounts += 1;
  }
}

describe('Block', () => {
  beforeEach(() => {
    document.body.replaceChildren();
  });

  it('рендерит шаблон, обновляет свойства и отдаёт ref', () => {
    const block = new LifeBlock({ label: 'Сохранить' });
    const element = block.element();

    expect(element?.textContent).toBe('Сохранить');
    expect(block.getRef('action')).toBe(element);
    expect(element?.getAttribute('ref')).toBeNull();

    block.setProps({ label: 'Готово' });

    expect(block.element()?.textContent).toBe('Готово');
    expect(block.mounts).toBe(2);
    expect(block.unmounts).toBe(1);
  });

  it('вешает обработчик события и перевешивает его после обновления', () => {
    const block = new LifeBlock({ label: 'Нажать' });

    document.body.append(block.element() as Element);
    block.element()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    block.setProps({ label: 'Ещё' });
    block.element()?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(block.clicks).toBe(2);
    expect(block.element()?.textContent).toBe('Ещё');
  });

  it('скрывает элемент и показывает его снова', () => {
    const block = new LifeBlock({ label: 'Скрыть' });

    document.body.append(block.element() as Element);
    block.hide();

    expect(document.body.querySelector('button')).toBeNull();
    expect(block.unmounts).toBe(1);

    block.show();

    expect(document.body.textContent).toContain('Скрыть');
    expect(block.mounts).toBe(2);
  });
});
