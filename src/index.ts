import App from './core/App/App';
import { ERRORS_ROUTES, ROUTES } from './shared/costants/routes.constant';

const app = new App({ title: 'Практикум Чат', routes: ROUTES, errorRoutes: ERRORS_ROUTES });
app.init();
