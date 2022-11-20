import * as DataLoader from 'dataloader';
import * as _ from 'underscore';
import { IModels } from '../connectionResolver';
import { sendFormsMessage } from '../messageBroker';

export default function generateDataLoaderFormField(models: IModels, subdomain: string) {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await sendFormsMessage({
      subdomain,
      action: 'fields.find',
      data: {
        query: {
          contentType: 'form',
          _id: { $in: ids }
        }
      },
      isRPC: true,
      defaultValue: []
    });
    const resultById = _.indexBy(result, '_id');
    return ids.map(id => resultById[id]);
  });
}
