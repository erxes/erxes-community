import {
  gatherNames,
  IDescriptions,
  LogDesc,
  putCreateLog as commonPutCreateLog,
  putUpdateLog as commonPutUpdateLog,
  putDeleteLog as commonPutDeleteLog
} from '@erxes/api-utils/src/logUtils';
import { IModels } from './connectionResolver';
import messageBroker, { sendTagsMessage } from './messageBroker';
import { IAssetDocument, IAssetGroupDocument } from './common/types/asset';

export const MODULE_NAMES = {
  ASSET: 'asset',
  ASSET_GROUP: 'assetGroup'
};

export const LOG_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete'
};

const gatherAssetFieldNames = async (models: IModels, subdomain: string, doc: IAssetDocument, prevList?: LogDesc[]): Promise<LogDesc[]> => {
  let options: LogDesc[] = [];

  if (prevList) {
    options = prevList;
  }

  if (doc.tagIds && doc.tagIds.length > 0) {
    options = await gatherNames({
      foreignKey: 'tagIds',
      prevList: options,
      nameFields: ['name'],
      items: await sendTagsMessage({
        subdomain,
        action: 'find',
        data: {
          _id: { $in: doc.tagIds }
        },
        isRPC: true,
        defaultValue: []
      })
    });
  }

  if (doc.groupId) {
    options = await gatherNames({
      foreignKey: 'groupId',
      prevList: options,
      nameFields: ['name'],
      items: await models.AssetGroup.find({
        _id: { $in: [doc.groupId] }
      }).lean()
    });
  }

  return options;
};

const gatherDescriptions = async (models: IModels, subdomain: string, params: any): Promise<IDescriptions> => {
  const { action, type, object, updatedDocument } = params;

  let extraDesc: LogDesc[] = [];
  const description = `"${object.name}" has been ${action}d`;

  switch (type) {
    case MODULE_NAMES.ASSET:
      extraDesc = await gatherAssetFieldNames(models, subdomain, object);

      if (updatedDocument) {
        extraDesc = await gatherAssetFieldNames(models, subdomain, updatedDocument, extraDesc);
      }

      break;
    case MODULE_NAMES.ASSET_GROUP:
      const parentIds: string[] = [];

      if (object.parentId) {
        parentIds.push(object.parentId);
      }

      if (updatedDocument && updatedDocument.parentId !== object.parentId) {
        parentIds.push(updatedDocument.parentId);
      }

      if (parentIds.length > 0) {
        extraDesc = await gatherNames({
          foreignKey: 'parentId',
          nameFields: ['name'],
          items: await models.AssetGroup.find({
            _id: { $in: parentIds }
          }).lean()
        });
      }

      break;
    default:
      break;
  }

  return { extraDesc, description };
};

export const putCreateLog = async (models: IModels, subdomain: string, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, subdomain, {
    ...logDoc,
    action: LOG_ACTIONS.CREATE
  });

  await commonPutCreateLog(subdomain, messageBroker(), { ...logDoc, description, extraDesc, type: `assets:${logDoc.type}` }, user);
};

export const putUpdateLog = async (models: IModels, subdomain: string, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, subdomain, {
    ...logDoc,
    action: LOG_ACTIONS.UPDATE
  });

  await commonPutUpdateLog(subdomain, messageBroker(), { ...logDoc, description, extraDesc, type: `assets:${logDoc.type}` }, user);
};

export const putDeleteLog = async (models: IModels, subdomain: string, logDoc, user) => {
  const { description, extraDesc } = await gatherDescriptions(models, subdomain, {
    ...logDoc,
    action: LOG_ACTIONS.DELETE
  });

  await commonPutDeleteLog(subdomain, messageBroker(), { ...logDoc, description, extraDesc, type: `assets:${logDoc.type}` }, user);
};
