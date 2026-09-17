import { resourcesHost } from '../constants/api.constant';

export default (path?: string | null): string | undefined => {
  if (!path) {
    return undefined;
  }

  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const resourcePath = path.startsWith('/') ? path : `/${path}`;

  return `${resourcesHost}${resourcePath}`;
};
