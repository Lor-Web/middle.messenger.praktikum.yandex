import type Block from '@/core/Block/Block';
import type { BlockOwnProps } from '@/core/Block/Block';

export const isEqualStr = (stringFirst?: string, stringSecond?: string) => {
  return stringFirst?.toLowerCase() === stringSecond?.toLowerCase();
};

type RenderOptions = {
  block: Block<BlockOwnProps>;
  title?: string;
};

export const render = (options: RenderOptions) => {
  if (options.title) {
    document.title = options.title;
  }

  const element = options.block.element();

  if (element) {
    document.body.appendChild(element);
  }
};
