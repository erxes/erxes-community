import { IModels } from '../connectionResolver';
import * as DataLoader from 'dataloader';
import { sendCoreMessage } from '../messageBroker';

export default function generateDataLoaderTeamMember(models: IModels, subdomain) {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await sendCoreMessage({
      subdomain,
      action: 'users.find',
      data: {
        query: { _id: { $in: ids } }
      },
      isRPC: true,
      defaultValue: []
    });

    return result;
  });
}
