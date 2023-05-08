import { sendContactsMessage, sendInboxMessage } from './messageBroker';

const searchMessages = (linkedin, criteria) => {
  return new Promise((resolve, reject) => {
    const messages: any = [];
  });
};

// controller for lms
const init = async app => {
  app.get('/login', async (req, res) => {
    res.send('login');
  });

  app.post('/receive', async (req, res, next) => {
    try {
      // write receive code here

      res.send('Successfully receiving message');
    } catch (e) {
      return next(new Error(e));
    }

    res.sendStatus(200);
  });
};

export default init;
