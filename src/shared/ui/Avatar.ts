import type { BlockOwnProps } from '@/core/Block/Block';
import Block from '@/core/Block/Block';

export interface AvatarProps extends BlockOwnProps {
  alt?: string;
  size?: 'large' | 'small' | 'medium';
  src?: string;
}

export default class Avatar extends Block<AvatarProps> {
  static componentName = 'Avatar';

  protected template = `
    <img 
      class="avatar ${this.props?.size ?? ''}" 
      src="{{#if src}}{{src}}{{else}}/no-avatar.webp{{/if}}" 
      alt="{{alt}}" 
    />
  `;
}
