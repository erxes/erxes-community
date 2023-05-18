import { IContext } from '../../connectionResolver';
import { sendTagsMessage } from '../../messageBroker';
import { IItemsGroupsDocument } from '../../models/definitions/items';

export default {
  __resolveReference({ _id }, { models }: IContext) {
    return models.ItemsGroups.findOne({ _id });
  },
  async tags(item: IItemsGroupsDocument, {}, { subdomain }: IContext) {
    return sendTagsMessage({
      subdomain,
      action: 'find',
      data: {
        _id: { $in: item.tagIds }
      },
      isRPC: true,
      defaultValue: []
    });
  }
};
