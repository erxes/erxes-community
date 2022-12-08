import { generateModels } from './connectionResolver';
import { getBoardItemLink } from './models/utils';

export default {
  editorAttributes: async () => {
    return [{ value: 'name', name: 'Name' }];
  }
};
