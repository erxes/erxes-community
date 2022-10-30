import * as DataLoader from 'dataloader';
import { IModels } from '../connectionResolver';

import riskAssessment from './riskAssessments/dataloaders/riskAssessments';

export interface IDataLoaders {
  riskAssessment: DataLoader<string, any>;
}

export function generateAllDataLoaders(models: IModels, subdomain: string): IDataLoaders {
  return {
    riskAssessment: riskAssessment(models)
  };
}
