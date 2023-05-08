import * as mongoose from 'mongoose';
import {
  ICategoryDocument,
  IChapterDocument,
  ICourseDocument,
  ILessonDocument,
  IModels,
  ITopicDocument
} from './models/definitions/lms';
import {
  ICategoryModel,
  IChapterModel,
  ITopicModel,
  loadCategoryClass,
  loadTopicClass,
  loadChapterClass,
  ILessonModel,
  loadLessonClass,
  ICourseModel,
  loadCourseClass
} from './models/lms';
import { IContext as IMainContext } from '@erxes/api-utils/src/types';
import { createGenerateModels } from '@erxes/api-utils/src/core';

export let models: IModels | null = null;

export interface IContext extends IMainContext {
  subdomain: string;
  models: IModels;
}

export const loadClasses = (db: mongoose.Connection): IModels => {
  models = {} as IModels;

  //   models.KnowledgeBaseArticles = db.model<IArticleDocument, IArticleModel>(
  //     'knowledgebase_articles',
  //     loadArticleClass(models)
  //   );

  //   models.KnowledgeBaseCategories = db.model<ICategoryDocument, ICategoryModel>(
  //     'knowledgebase_categories',
  //     loadCategoryClass(models)
  //   );

  models.LmsTopics = db.model<ITopicDocument, ITopicModel>(
    'lms_topics',
    loadTopicClass(models)
  );
  models.LmsCategories = db.model<ICategoryDocument, ICategoryModel>(
    'lms_categories',
    loadCategoryClass(models)
  );
  models.LmsChapters = db.model<IChapterDocument, IChapterModel>(
    'lms_chapters',
    loadChapterClass(models)
  );

  models.LmsLessons = db.model<ILessonDocument, ILessonModel>(
    'lms_lessons',
    loadLessonClass(models)
  );
  models.LmsCourses = db.model<ICourseDocument, ICourseModel>(
    'lms_courses',
    loadCourseClass(models)
  );

  return models;
};

export const generateModels = createGenerateModels<IModels>(
  models,
  loadClasses
);
