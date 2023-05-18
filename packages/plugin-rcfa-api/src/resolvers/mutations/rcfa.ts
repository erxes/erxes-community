import { IContext } from '@erxes/api-utils/src';
import { generateModels, IModels } from '../../connectionResolver';
import { IRCFADocument } from '@packages/plugin-rcfa-api/src/models/definitions/rcfa';
import { IRCFA } from '../../models/definitions/rcfa';

interface IQuestionContext extends IContext {
  subdomain: string;
  user: any;
}

const rcfaMutations = {};

export default rcfaMutations;
