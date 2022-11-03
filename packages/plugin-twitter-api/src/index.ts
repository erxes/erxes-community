import init from './controller';

const initApp = async app => {
  init(app);

  app.use((error, _req, res, _next) => {
    console.error(error.stack);
    res.status(500).send(error.message);
  });
};

export default initApp;
