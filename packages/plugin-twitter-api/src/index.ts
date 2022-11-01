import initTwitter from './controller';

const initApp = async app => {
  console.log('END orj IRSEn uu?');

  // init bots
  initTwitter(app);

  // Error handling middleware
  app.use((error, _req, res, _next) => {
    console.error(error.stack);
    res.status(500).send(error.message);
  });
};

export default initApp;
