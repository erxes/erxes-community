import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { IConfigModel, loadConfigs } from './models/Configs';
import { ISubmissionDocument } from './models/definitions/submissions';
import {
  IItemsGroupsDocument,
  IConfigsDocument,
  IItemsDocument
} from './models/definitions/items';
import { IOperationsDocument } from './models/definitions/operations';
import {
  IAssessmentItemssDocument,
  IAssessmentsDocument,
  itemsGroupSchema,
  itemsSchema
} from './models/definitions/assessment';
import { ISubmissionModel, loadSubmissions } from './models/Submissions';
import { IOperationsModel, loadOperations } from './models/Operations';
import { IAssessmentsModel, loadAssessments } from './models/Assessment';
import {
  IItemsGroupsModel,
  IItemsModel,
  loadItemsGroups,
  loadItems
} from './models/Items';

export interface IModels {
  Items: IItemsModel;
  ItemsGroups: IItemsGroupsModel;
  Assessments: IAssessmentsModel;
  AssessmentsItems: Model<any>;
  AssessmentsGroups: Model<any>;
  AssessmentsSubmissions: ISubmissionModel;
  Configs: IConfigModel;
  Operations: IOperationsModel;
}

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  subdomain: string
): IModels => {
  models = {} as IModels;

  models.Items = db.model<IItemsDocument, IItemsModel>(
    'form_items',
    loadItems(models, subdomain)
  );

  models.ItemsGroups = db.model<IItemsGroupsDocument, IItemsGroupsModel>(
    'form_items_groups',
    loadItemsGroups(models, subdomain)
  );

  models.Assessments = db.model<IAssessmentsDocument, IAssessmentsModel>(
    'form_assessments',
    loadAssessments(models, subdomain)
  );

  models.AssessmentsItems = db.model<IAssessmentItemssDocument, any>(
    'form_assessments_items',
    itemsSchema
  );

  models.AssessmentsGroups = db.model<any, any>(
    'form_assessments_groups',
    itemsGroupSchema
  );

  models.AssessmentsSubmissions = db.model<
    ISubmissionDocument,
    ISubmissionModel
  >('form_assessments_submissions', loadSubmissions(models, subdomain));

  models.Configs = db.model<IConfigsDocument, IConfigModel>(
    'forms_configs',
    loadConfigs(models, subdomain)
  );

  models.Operations = db.model<IOperationsDocument, IOperationsModel>(
    'operations',
    loadOperations(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
