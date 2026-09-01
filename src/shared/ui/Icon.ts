import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

export interface IconProps extends BlockOwnProps {
  name: string;
}

export default class Icon extends Block<IconProps> {
  static componentName = 'Icon';

  protected template = `
    <div class="icon">
      {{getIcon name}}
    </div>
  `;
}
