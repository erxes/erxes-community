import { IContext } from '../../../connectionResolver';

interface ICreateQuestion {
  question: string;
  parentId: string;
  mainType: string;
  mainTypeId: string;
}

const rcfaIssuesMutations = {
  async addRcfaIssue(
    _root: any,
    args: ICreateQuestion,
    { models, user }: IContext
  ) {
    return await models.Issues.addIssue(args, user);
  },

  async editRcfaIssue(_root, { _id, ...doc }, { models }: IContext) {
    return await models.Issues.editIssue(_id, doc);
  },

  async deleteRcfaIssue(_root, { _id }, { models }: IContext) {
    return await models.Issues.removeIssue(_id);
  }
};

export default rcfaIssuesMutations;
