import * as DataLoader from 'dataloader';
import { IModels } from '../connectionResolver';

import {
  generateDataLoaderBoards as board,
  generateDataLoaderField as field,
  generateDataLoaderPipelines as pipeline,
  generateDataLoaderAssessments as assessment,
  generateDataLoaderItem as item,
  generateDataLoaderStages as stage,
  generateDataLoaderUser as user
} from './generateDataLoaders';

export interface IDataLoaders {
  item: DataLoader<string, any>;
  assessment: DataLoader<string, any>;
  user: DataLoader<string, any>;
  board: DataLoader<string, any>;
  pipeline: DataLoader<string, any>;
  stage: DataLoader<string, any>;
  field: DataLoader<string, any>;
}

export function generateAllDataLoaders(
  models: IModels,
  subdomain: string
): IDataLoaders {
  return {
    item: item(models),
    assessment: assessment(models),
    user: user(models, subdomain),
    board: board(models, subdomain),
    pipeline: pipeline(models, subdomain),
    stage: stage(models, subdomain),
    field: field(models, subdomain)
  };
}
