import init from './controller';
import { initStart } from './startup';

const initApp = async app => {
  initStart(app);
  init(app);

  app.use((error, _req, res, _next) => {
    console.error(error.stack);
    res.status(500).send(error.message);
  });
};

export default initApp;
