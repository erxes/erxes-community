import * as mongoose from 'mongoose';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';
import {
  IRiskAssessmentCategoriesModel,
  loadAssessmentCategories
} from './models/RiskAssessments/Categories';
import { IRiskAssessmentsModel, loadRiskAssessments } from './models/RiskAssessments';
import {
  loadRiskConformities,
  IRiskConformitiesModel
} from './models/RiskAssessments/Conformities';
import {
  IOperationCategoriesDocument,
  IOperationsDocument,
  IRiskAssessmentCategoriesDocument,
  IRiskAssessmentsDocument,
  IRiskConformitiesDocument,
  IRiskFormSubmissionsDocument
} from './common/types/riskAssessment';
import {
  loadRiskFormSubmissions,
  IRiskFormSubmissionsModel
} from './models/RiskAssessments/FormSubmissions';
import { IOperationsModel, loadOperations } from './models/Operations/Operations';
import { IOperationCategoriesModel, loadOperationCategories } from './models/Operations/Categories';

export interface IModels {
  RiskAssessments: IRiskAssessmentsModel;
  RiskAssessmentCategories: IRiskAssessmentCategoriesModel;
  RiskConformities: IRiskConformitiesModel;
  RiksFormSubmissions: IRiskFormSubmissionsModel;
  Operations: IOperationsModel;
  OperationCategories: IOperationCategoriesModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (db: mongoose.Connection, subdomain: string): IModels => {
  models = {} as IModels;

  models.RiskAssessments = db.model<IRiskAssessmentsDocument, IRiskAssessmentsModel>(
    'risk_assessments',
    loadRiskAssessments(models, subdomain)
  );
  models.RiskAssessmentCategories = db.model<
    IRiskAssessmentCategoriesDocument,
    IRiskAssessmentCategoriesModel
  >('risk_assessment_categories', loadAssessmentCategories(models, subdomain));
  models.RiskConformities = db.model<IRiskConformitiesDocument, IRiskConformitiesModel>(
    'risk_assessment_conformities',
    loadRiskConformities(models, subdomain)
  );
  models.RiksFormSubmissions = db.model<IRiskFormSubmissionsDocument, IRiskFormSubmissionsModel>(
    'risk_form_submissions',
    loadRiskFormSubmissions(models, subdomain)
  );
  models.Operations = db.model<IOperationsDocument, IOperationsModel>(
    'audit_operations',
    loadOperations(models, subdomain)
  );
  models.OperationCategories = db.model<IOperationCategoriesDocument, IOperationCategoriesModel>(
    'audit_operation_categories',
    loadOperationCategories(models, subdomain)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(models, loadClasses);
