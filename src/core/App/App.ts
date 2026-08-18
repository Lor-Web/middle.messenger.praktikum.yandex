import { registerComponents } from '../../shared/lib/registerComponents';
import { registerHelpers } from '../../shared/lib/registerHelpers';
import type { AppProps, ErrorRoute, Route } from '../../shared/models/app.type';

export default class App {
  public appElement?: HTMLElement;

  private title;
  private routes;
  private errorRoutes;

  constructor(appSettings: AppProps) {
    this.title = appSettings?.title ?? 'app';
    this.routes = appSettings?.routes ?? [];
    this.errorRoutes = appSettings?.errorRoutes ?? [];
  }

  private element() {
    const APP_CONTAINER = document.createElement('div');
    APP_CONTAINER.classList.add('app');

    return APP_CONTAINER;
  }

  private render(route: Route | ErrorRoute) {
    const Component = route?.block;
    const props = route?.props ?? {};

    if (route?.title) {
      document.title = route.title;
    }

    if (Component) {
      const page = new Component(props);
      const element = page.element();
      this.appElement?.appendChild(element!);
    }
  }

  private routing() {
    const path = window.location.pathname.split('/').filter((v) => v !== '')[0];

    if (!path) {
      window.location.pathname = 'auth';
      return;
    }

    const page = this.routes.find((r) => path === r.path);

    if (!page) {
      const route = this.errorRoutes.find((eR) => eR.code === 404);
      if (route) this.render(route);
      return;
    } else {
      this.render(page);
    }
  }

  public init() {
    const element = this.element();

    document.title = this.title;
    document.body.appendChild(element);

    this.appElement = element;

    registerHelpers();
    registerComponents();
    this.routing();
  }
}
