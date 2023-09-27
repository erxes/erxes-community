import * as DataLoader from 'dataloader';
import * as _ from 'underscore';
import assetCategory from './assetCategory';
import tag from './tag';
import company from './company';
import uom from './uom';
import { IModels } from '../connectionResolver';

export interface IDataLoaders {
  assetCategory: DataLoader<string, any>;
  tag: DataLoader<string, any>;
  company: DataLoader<string, any>;
  uom: DataLoader<string, any>;
}

export function generateAllDataLoaders(models: IModels, subdomain: string): IDataLoaders {
  return {
    assetCategory: assetCategory(models),
    tag: tag(subdomain),
    company: company(subdomain),
    uom: uom(models)
  };
}
