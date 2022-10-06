import { IModels } from '../connectionResolver';
import * as DataLoader from 'dataloader';
import { sendContactsMessage } from '../messageBroker';

export default function generateDataLoaderCustomer(models: IModels, subdomain) {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result = await sendContactsMessage({
      subdomain,
      action: 'customers.find',
      data: { _id: { $in: ids } },
      isRPC: true,
      defaultValue: []
    });
    return result;
  });
}
