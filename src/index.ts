import { ERRORS_ROUTES, ROUTES } from '@/shared/constants/routes.constant';

import App from './core/App/App';

const app = new App({ title: 'Практикум Чат', routes: ROUTES, errorRoutes: ERRORS_ROUTES });
app.init();
