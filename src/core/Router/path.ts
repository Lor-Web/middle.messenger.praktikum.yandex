export type PathParams = Record<string, string>;

export type PathMatch = {
  params: PathParams;
};

export const normalizePath = (pathname: string): string => {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const withSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;

  return withSlash.length > 1 && withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
};

export const joinPaths = (...parts: string[]): string => {
  const joined = parts
    .flatMap((part) => part.split('/'))
    .filter(Boolean)
    .join('/');

  return normalizePath(joined);
};

export const matchPath = (pattern: string, pathname: string): PathMatch | null => {
  const patternParts = normalizePath(pattern).split('/').filter(Boolean);
  const pathParts = normalizePath(pathname).split('/').filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return null;
  }

  const params: PathParams = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
      continue;
    }

    if (patternPart.toLowerCase() !== pathPart.toLowerCase()) {
      return null;
    }
  }

  return { params };
};

export const rankPath = (pattern: string): number => {
  return normalizePath(pattern)
    .split('/')
    .filter(Boolean)
    .reduce((score, part) => score + (part.startsWith(':') ? 1 : 10), 0);
};
