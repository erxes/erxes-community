import { IContext } from '@erxes/api-utils/src';

const RCFAQueries = {
  rcfaQuestions(_root, args, {}: IContext) {
    return [];
  },

  rcfaQuestionsTotalCount(_root, args, {}: IContext) {
    return 0;
  }
};

export default RCFAQueries;
