import { IContext } from '../../../connectionResolver';
import { sendCardsMessage } from '../../../messageBroker';

const rcfaMutations = {
  async resolveRCFA(_root, args, { models, subdomain }: IContext) {
    const { mainType, mainTypeId, destinationType, destinationStageId } = args;

    if (!destinationType || !destinationStageId) {
      throw new Error('Cannot resolve rcfa');
    }

    const rcfa = await models.RCFA.findOne({ mainType, mainTypeId });

    if (!rcfa) {
      throw new Error('Something went wrong');
    }

    const issue = await models.Issues.findOne({ rcfaId: rcfa._id }).sort({
      createdAt: -1
    });

    const payload = {
      type: destinationType,
      sourceType: mainType,
      itemId: mainTypeId,
      name: issue?.issue || '',
      stageId: destinationStageId
    };

    const relItem = await sendCardsMessage({
      subdomain: subdomain,
      action: 'createRelatedItem',
      data: payload,
      isRPC: true
    });

    return await models.RCFA.updateOne(
      { _id: rcfa._id },
      {
        $set: {
          status: 'resolved',
          closedAt: new Date(),
          relType: destinationType,
          relTypeId: relItem._id
        }
      }
    );
  }
};

export default rcfaMutations;
