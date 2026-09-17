import { NOT_FOUND_PATH } from '@/shared/constants/paths.constant';
import { ROUTES } from '@/shared/constants/routes.constant';
import type { Route as RouteType, RouteAccess } from '@/shared/models/app.type';

import authMiddleware from './authMiddleware';
import { joinPaths, normalizePath } from './path';
import Route from './Route';

type Middleware = (route: Route) => string | undefined | Promise<string | undefined>;

export default class Router {
  history = window.history;

  private _routes: Route[] = [];
  private _currentRoute: Route | null = null;
  private _middlewares: Middleware[] = [];
  private _navigation = 0;
  private static __instance: Router | null = null;

  constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;

    this.initRoutes(ROUTES);
    this._routes.sort((a, b) => b.rank - a.rank);
    this.use(authMiddleware);
  }

  start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  use(middleware: Middleware) {
    this._middlewares.push(middleware);
    return this;
  }

  getRoute(pathname: string) {
    const path = normalizePath(pathname);

    for (const route of this._routes) {
      const matched = route.match(path);

      if (matched) {
        return { route, params: matched.params };
      }
    }

    return null;
  }

  go(pathname: string) {
    const path = normalizePath(pathname);
    this.history.pushState({}, '', path);
    this._onRoute(path);
  }

  private async _onRoute(pathname: string) {
    const navigation = ++this._navigation;
    const matched = this.getRoute(pathname) ?? this.getRoute(NOT_FOUND_PATH);

    if (!matched) {
      return;
    }

    const redirect = await this.runMiddlewares(matched.route);

    if (navigation !== this._navigation) {
      return;
    }

    if (redirect) {
      const path = normalizePath(redirect);

      if (path !== normalizePath(pathname)) {
        this.history.replaceState({}, '', path);
        this._onRoute(path);
      }

      return;
    }

    const { route, params } = matched;

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render(params);
  }

  private async runMiddlewares(route: Route) {
    for (const middleware of this._middlewares) {
      const redirect = await middleware(route);

      if (redirect) {
        return redirect;
      }
    }

    return undefined;
  }

  private initRoutes(routes: RouteType[], parentPath = '', parentAccess?: RouteAccess) {
    routes.forEach((routeConfig) => {
      const path = joinPaths(parentPath, routeConfig.path ?? '');
      const access = routeConfig.access ?? parentAccess ?? 'protected';

      this._routes.push(
        new Route({
          ...routeConfig,
          path,
          access,
        }),
      );

      if (routeConfig.children?.length) {
        this.initRoutes(routeConfig.children, path, access);
      }
    });
  }
}
