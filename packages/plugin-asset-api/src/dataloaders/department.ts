import { IModels } from '../connectionResolver';
import * as DataLoader from 'dataloader';
import { sendCoreMessage } from '../messageBroker';
export default function generateDataLoaderDepartment(models: IModels, subdomain) {
  return new DataLoader<string, any>(async (ids: readonly string[]) => {
    const result: any[] = await sendCoreMessage({
      subdomain,
      action: 'departments.find',
      data: {
        _id: { $in: ids }
      },
      isRPC: true,
      defaultValue: []
    });
    return result;
  });
}
