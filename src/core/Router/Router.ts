import { ROUTES } from '@/shared/constants/routes.constant';
import type { Route as RouteType } from '@/shared/models/app.type';

import { joinPaths, normalizePath } from './path';
import Route from './Route';

export default class Router {
  history = window.history;

  private _routes: Route[] = [];
  private _currentRoute: Route | null = null;
  private static __instance: Router | null = null;

  constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;

    this.initRoutes(ROUTES);
    this._routes.sort((a, b) => b.rank - a.rank);
  }

  start() {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    this._onRoute(window.location.pathname);
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

  private _onRoute(pathname: string) {
    const matched = this.getRoute(pathname);

    if (!matched) {
      return;
    }

    const { route, params } = matched;

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render(params);
  }

  private initRoutes(routes: RouteType[], parentPath = '') {
    routes.forEach((routeConfig) => {
      const path = joinPaths(parentPath, routeConfig.path ?? '');

      this._routes.push(
        new Route({
          ...routeConfig,
          path,
        }),
      );

      if (routeConfig.children?.length) {
        this.initRoutes(routeConfig.children, path);
      }
    });
  }
}
