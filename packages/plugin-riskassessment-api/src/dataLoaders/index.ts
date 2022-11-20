import * as DataLoader from 'dataloader';
import { IModels } from '../connectionResolver';

import categories from './category';
import riskAssessment from './riskAssessment';
import user from './user';
import formField from './formField';

export interface IDataLoaders {
  riskAssessment: DataLoader<string, any>;
  categories: DataLoader<string, any>;
  user: DataLoader<string, any>;
  formField: DataLoader<string, any>;
}

export function generateAllDataLoaders(models: IModels, subdomain: string): IDataLoaders {
  return {
    riskAssessment: riskAssessment(models),
    categories: categories(models),
    user: user(models, subdomain),
    formField: formField(models, subdomain)
  };
}
