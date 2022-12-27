import { sendCommonMessage } from '../../messageBroker';

const Discussion = {
  async questionsWithAnswer(discussion, _args, { subdomain, models }) {
    const results: any = [];

    const answers = await models.Votes.find({
      discussionId: discussion._id,
      answer: { $exists: true }
    });

    const answeredUserIds = answers.map(a => a.createdUserId);

    // const answeredUsers = await sendCommonMessage({
    //   subdomain,
    //   serviceName: 'clientportal',
    //   action: 'clientPortalUsers.find',
    //   data: {
    //     _id: { $in: answeredUserIds },
    //   },
    // });

    const answeredUsers = answeredUserIds.map(i => ({ _id: i }));

    for (const question of discussion.questions || []) {
      results.push({
        question,
        answeredUsers
      });
    }

    return results;
  },

  async currentUserVote(discussion, _args, { cpUser, models }) {
    const answer = await models.Votes.findOne({
      discussionId: discussion._id,
      answer: { $exists: true },
      createdUserId: cpUser.userId
    });

    const upDown = await models.Votes.findOne({
      discussionId: discussion._id,
      isUp: { $exists: true },
      createdUserId: cpUser.userId
    });

    return {
      isUp: upDown ? upDown.isUp : false,
      answer: answer && answer.answer
    };
  },

  async comments(discussion, _args, { models }) {
    return models.Comments.find({
      discussionId: discussion._id
    });
  }
};

export { Discussion };
