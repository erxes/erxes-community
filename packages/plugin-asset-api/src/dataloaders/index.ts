import * as DataLoader from 'dataloader';
import { IModels } from '../connectionResolver';
import assetGroup from './assetGroup';
import company from './company';

export interface IDataLoaders {
  assetGroup: DataLoader<string, any>;
  company: DataLoader<string, any>;
}

export function generateAllDataLoaders(models: IModels, subdomain: string): IDataLoaders {
  return {
    assetGroup: assetGroup(models),
    company: company(subdomain)
  };
}
