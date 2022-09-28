import { IModels } from './connectionResolver';

export async function checkCodeDuplication(models: IModels, code: string) {
  if (code.includes('/')) {
    throw new Error('The "/" character is not allowed in the code');
  }

  const group = await models.AssetGroup.findOne({
    code
  });

  if (group) {
    throw new Error('Code must be unique');
  }
}
