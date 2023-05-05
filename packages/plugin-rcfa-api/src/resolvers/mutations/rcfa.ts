import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import mod from '../../graphql';

const RCFAMutations = {
  async addRcfaQuestions(_root, { name }, { user }: IContext) {
    console.log(user);

    const model = await generateModels('subdomain');

    const newQuestion = await model.RCFAQuestions.create({
      title: name,
      status: 'created',
      createdAt: new Date(),
      createdUser: user._id
    });

    return newQuestion;
  }
};

export default RCFAMutations;
