import type { BlockOwnProps } from '../../core/Block/Block';
import Block from '../../core/Block/Block';

export interface CounterProps extends BlockOwnProps {
  count: number;
}

export default class Counter extends Block<CounterProps> {
  static componentName = 'Counter';

  protected template = `
    <div class="counter">
      {{count}}
    </div>
  `;
}
