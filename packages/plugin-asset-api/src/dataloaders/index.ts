import * as DataLoader from 'dataloader';
import { IModels } from '../connectionResolver';
import assetGroup from './assetGroup';
import company from './company';
import asset from './asset';

export interface IDataLoaders {
  asset: DataLoader<string, any>;
  assetGroup: DataLoader<string, any>;
  company: DataLoader<string, any>;
}

export function generateAllDataLoaders(models: IModels, subdomain: string): IDataLoaders {
  return {
    assetGroup: assetGroup(models),
    asset: asset(models),
    company: company(subdomain)
  };
}
