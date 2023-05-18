import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { IRCFAQuestionsDocument } from '@packages/plugin-rcfa-api/src/models/definitions/question';
import { IRCFAQuestions } from '../../models/definitions/question';
import mod from '../../graphql';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

interface ICreateQuestion {
  question: string;
  parentId: string;
  mainType: string;
  mainTypeId: string;
}

const rcfaQuestionMutations = {
  async addRcfaQuestions(
    _root: any,
    data: ICreateQuestion,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);

    let rcfaId = '';
    const rcfa = await model.RCFA.findOne(
      { mainType: data.mainType, mainTypeId: data.mainTypeId },
      '_id'
    );

    if (rcfa) {
      rcfaId = rcfa._id;
    } else {
      const rcfa = await model.RCFA.create({
        mainType: data.mainType,
        mainTypeId: data.mainTypeId,
        status: 'open',
        createdAt: new Date(),
        createdUser: context.user._id
      });
      rcfaId = rcfa._id;
    }

    const newQuestion: IRCFAQuestionsDocument = await model.RCFAQuestions.create(
      {
        question: data.question,
        parentId: data.parentId,
        rcfaId: rcfaId,
        createdAt: new Date(),
        createdUser: context.user._id
      }
    );

    return newQuestion;
  },

  async editRcfaQuestions(
    _root,
    { _id, question }: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);
    await model.RCFAQuestions.findByIdAndUpdate(_id, { $set: { question } });

    return model.RCFAQuestions.findOne({ _id });
  },

  async deleteRcfaQuestions(
    _root,
    { _id }: IRCFAQuestions,
    context: IQuestionContext
  ) {
    const model: IModels = await generateModels(context.subdomain);
    const deleteItem = await model.RCFAQuestions.findOne({ _id });
    if (deleteItem) {
      await model.RCFAQuestions.findOneAndUpdate(
        { parentId: _id },
        { $set: { parentId: deleteItem.parentId } }
      );
    }

    return model.RCFAQuestions.deleteOne({ _id });
  }
};

export default rcfaQuestionMutations;
