import { loadAppData } from './core/GlobalStore/load';
import Router from './core/Router/Router';
import { registerComponents } from './shared/lib/registerComponents';
import { registerHelpers } from './shared/lib/registerHelpers';

registerHelpers();
registerComponents();

loadAppData();

const router = new Router();
router.start();
