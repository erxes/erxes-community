import { IRCFAQuestions } from '../../../../plugin-rcfa-api/src/models/definitions/rcfa';

const rcfaQueries = {
  getQuestions(title: string, parent?: string) {
    console.log('MUTATION', title);

    const result: IRCFAQuestions[] = [
      {
        _id: 'bQZMT7FtTLc3twrC5',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T08:38:39.043Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      },
      {
        _id: 'JbtnwzLCtngHL3EmF',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T08:39:21.846Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      },
      {
        _id: 'RPSXouAKqKMZq2HQq',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T09:01:24.059Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      },
      {
        _id: 'Z2ZGnZN26qFuLd47k',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T09:09:06.224Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      },
      {
        _id: 'eaezg76eJaLWpiJpt',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-05T09:10:15.205Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      },
      {
        _id: 'aRQcXYLG28wGXmo73',
        title: 'test',
        status: 'created',
        createdAt: '2023-05-08T07:35:07.168Z',
        createdUser: 'EHPWejW9Jpz33YNuf',
        __v: 0
      }
    ];

    return result;
  }
};

export default rcfaQueries;
