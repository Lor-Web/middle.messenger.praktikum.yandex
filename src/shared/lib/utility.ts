import type Block from '@/core/Block/Block';
import type { BlockOwnProps } from '@/core/Block/Block';

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

export const isEqualStr = (stringFirst?: string, stringSecond?: string) => {
  return stringFirst?.toLowerCase() === stringSecond?.toLowerCase();
};

export const isObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

export const _trim = (str: string, chars?: string): string => {
  // Если chars не указан - используем стандартный trim
  if (!chars) {
    return str.trim();
  }

  // Превращаем строку chars в массив символов для удаления
  const charsToRemove = chars.split('');

  let start = 0;
  let end = str.length - 1;

  // Удаляем с начала
  while (start <= end && charsToRemove.includes(str[start])) {
    start++;
  }

  // Удаляем с конца
  while (end >= start && charsToRemove.includes(str[end])) {
    end--;
  }

  // Возвращаем подстроку без удаленных символов
  return str.substring(start, end + 1);
};

export type Indexed<T = unknown> = {
  [key in string]: T;
};

export const merge = (lhs: Indexed, rhs: Indexed): Indexed => {
  const result: Indexed = Object.assign({}, lhs);

  for (const key in rhs) {
    if (!Object.prototype.hasOwnProperty.call(rhs, key)) continue;

    const rhsValue = rhs[key];
    const lhsValue = result[key];

    if (isObject(rhsValue)) {
      if (isObject(lhsValue)) {
        // Рекурсивное слияние с явным приведением типов
        result[key] = merge(lhsValue as Indexed, rhsValue as Indexed);
      } else {
        // Создаем копию объекта
        result[key] = Object.assign({}, rhsValue);
      }
    } else {
      result[key] = rhsValue;
    }
  }

  return result;
};

export const set = (object: Indexed | unknown, path: string, value: unknown): Indexed | unknown => {
  if (!isObject(object)) {
    return object;
  }

  if (!(typeof path === 'string')) {
    throw new Error('path must be string');
  }

  const paths = path.split('.');

  const secondObj = paths.reduceRight((acc, key) => {
    return { [key]: acc };
  }, value);

  return merge(secondObj as Indexed, object as Indexed);
};
