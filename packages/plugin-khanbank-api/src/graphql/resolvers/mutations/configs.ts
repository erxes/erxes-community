import { checkPermission, requireLogin } from '@erxes/api-utils/src';
import { IContext } from '../../../connectionResolver';
import { IKhanbankConfig } from '../../../models/definitions/khanbankConfigs';

const mutations = {
  async khanbankConfigsAdd(_root, args: IKhanbankConfig, { models }: IContext) {
    return models.KhanbankConfigs.createConfig(args);
  },

  async khanbankConfigsEdit(
    _root,
    args: {
      _id: string;
    } & IKhanbankConfig,
    { models }: IContext
  ) {
    return models.KhanbankConfigs.updateConfig(args._id, args);
  },

  async khanbankConfigsRemove(
    _root,
    { _id }: { _id: string },
    { models }: IContext
  ) {
    return models.KhanbankConfigs.removeConfig(_id);
  }
};

requireLogin(mutations, 'khanbankConfigsAdd');
requireLogin(mutations, 'khanbankConfigsEdit');
requireLogin(mutations, 'khanbankConfigsRemove');

checkPermission(mutations, 'khanbankConfigsAdd', 'khanbankConfigsAdd', []);
checkPermission(mutations, 'khanbankConfigsEdit', 'khanbankConfigsEdit', []);
checkPermission(
  mutations,
  'khanbankConfigsRemove',
  'khanbankConfigsRemove',
  []
);

export default mutations;
