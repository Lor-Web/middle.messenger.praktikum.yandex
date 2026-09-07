import { ROUTES } from '@/shared/constants/routes.constant';

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

    ROUTES.forEach((routeConfig) =>
      this._routes.push(
        new Route({ path: routeConfig.path, block: routeConfig.block, props: routeConfig.props }),
      ),
    );
  }

  start() {
    const path = window.location.pathname.split('/')[1];

    window.onpopstate = (e: PopStateEvent) => {
      const newPath = (e.currentTarget as Window)?.location.pathname.split('/')[1];
      this._onRoute(newPath);
    };

    this._onRoute(path);
  }

  getRoute(pathname: string) {
    return this._routes.find((route) => route.match(pathname));
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  private _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }
}
