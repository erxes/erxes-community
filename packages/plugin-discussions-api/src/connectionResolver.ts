import * as mongoose from 'mongoose';
import {
  IDiscussionModel,
  loadDiscussionClass,
  IDiscussionDocument
} from './models/Discussions';
import { IVoteModel, loadVoteClass, IVoteDocument } from './models/Votes';
import {
  ICommentModel,
  loadCommentClass,
  ICommentDocument
} from './models/Comments';
import { IContext as IMainContext } from '@erxes/api-utils/src';
import { createGenerateModels } from '@erxes/api-utils/src/core';

export interface IModels {
  Discussions: IDiscussionModel;
  Comments: ICommentModel;
  Votes: IVoteModel;
}
export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export let models: IModels | null = null;

export const loadClasses = (
  db: mongoose.Connection,
  _subdomain: string
): IModels => {
  models = {} as IModels;

  models.Discussions = db.model<IDiscussionDocument, IDiscussionModel>(
    'discussions',
    loadDiscussionClass(models)
  );

  models.Votes = db.model<IVoteDocument, IVoteModel>(
    'discussions_votes',
    loadVoteClass(models)
  );

  models.Comments = db.model<ICommentDocument, ICommentModel>(
    'discussions_comments',
    loadCommentClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
