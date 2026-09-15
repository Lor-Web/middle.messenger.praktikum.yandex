import Router from './core/Router/Router';
import { registerComponents } from './shared/lib/registerComponents';
import { registerHelpers } from './shared/lib/registerHelpers';

registerHelpers();
registerComponents();

const router = new Router();
router.start();
