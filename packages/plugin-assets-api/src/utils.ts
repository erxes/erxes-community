import { LOG_ACTIONS } from '@erxes/api-utils/src/logUtils';
import { IModels } from './connectionResolver';
import messageBroker from './messageBroker';

export const MODULE_NAMES = {
  PRODUCT_CATEGORY: 'productCategory'
};

export const putDeleteLog = async (
  models: IModels,
  subdomain: string,
  logDoc,
  user
) => {
  const { description, extraDesc } = await gatherDescriptions(
    models,
    subdomain,
    {
      ...logDoc,
      action: LOG_ACTIONS.DELETE
    }
  );

  await commonPutDeleteLog(
    subdomain,
    messageBroker(),
    { ...logDoc, description, extraDesc, type: `products:${logDoc.type}` },
    user
  );
};

function gatherDescriptions(
  models: IModels,
  subdomain: string,
  arg2: any
):
  | { description: any; extraDesc: any }
  | PromiseLike<{ description: any; extraDesc: any }> {
  throw new Error('Function not implemented.');
}
function commonPutDeleteLog(
  subdomain: string,
  arg1: any,
  arg2: any,
  user: any
) {
  throw new Error('Function not implemented.');
}
