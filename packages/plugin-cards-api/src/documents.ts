import { generateModels } from './connectionResolver';
import { sendCoreMessage } from './messageBroker';

export default {
  editorAttributes: async () => {
    return [
      { value: 'name', name: 'Name' },
      { value: 'createdAt', name: 'Created at' },
      { value: 'closeDate', name: 'Close date' },
      { value: 'description', name: 'Description' },
      { value: 'productsInfo', name: 'Products information' },
      { value: 'assignedUsers', name: 'Assigned users' }
    ];
  },

  replaceContent: async ({ subdomain, data: { stageId, itemId, content } }) => {
    const models = await generateModels(subdomain);
    const stage = await models.Stages.findOne({ _id: stageId });

    if (!stage) {
      return '';
    }

    let collection;

    if (stage.type == 'deal') {
      collection = models.Deals;
    }

    if (stage.type == 'ticket') {
      collection = models.Tickets;
    }

    if (stage.type == 'task') {
      collection = models.Tasks;
    }

    if (stage.type == 'growthHack') {
      collection = models.GrowthHacks;
    }

    if (!collection) {
      return '';
    }

    const item = await collection.findOne({ _id: itemId });

    if (!item) {
      return '';
    }

    const simpleFields = ['name', 'createdAt', 'closeAt', 'description'];

    let replacedContent = content;

    for (const field of simpleFields) {
      replacedContent = replacedContent.replace(`{{ ${field} }}`, item[field]);
    }

    const users = await sendCoreMessage({
      subdomain,
      action: 'users.find',
      isRPC: true,
      data: {
        query: { _id: { $in: item.assignedUserIds || [] } }
      }
    });

    replacedContent = replacedContent.replace(
      '{{ assignedUsers }}',
      users
        .map(user => `${user.firstName || ''} ${user.lastName || ''}`)
        .join(',')
    );

    return replacedContent;
  }
};
