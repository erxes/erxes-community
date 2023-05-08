import { field, schemaWrapper } from '@erxes/api-utils/src/definitions/utils';
import { Schema, Document } from 'mongoose';
import {
  ICategoryModel,
  IChapterModel,
  ICourseModel,
  ILessonModel,
  ITopicModel
} from '../lms';
import { attachmentSchema } from '@erxes/api-utils/src/types';
import { PUBLISH_STATUSES } from './constants';

const commonFields = {
  createdBy: field({ type: String, label: 'Created by' }),
  createdDate: field({ type: Date, label: 'Created at' }),
  modifiedBy: field({ type: String, label: 'Modified by' }),
  modifiedDate: field({ type: Date, label: 'Modified at' }),
  title: field({ type: String, label: 'Title' })
};

interface ICommonFields {
  createdBy: string;
  createdDate: Date;
  modifiedBy: string;
  modifiedDate: Date;
}

export interface ITopic {
  title?: string;
  description?: string;
  brandId?: string;
  categoryIds?: string[];
  color?: string;
  backgroundImage?: string;
  languageCode?: string;
  notificationSegmentId?: string;
}

export interface ITopicDocument extends ITopic, Document {
  _id: string;
}

export interface ICategory {
  title?: string;
  description?: string;
  courseIds?: string[];
  icon?: string;
  parentCategoryId?: string;
}
export interface ICourse {
  title?: string;
  name: string;
  categoryId?: string;
}

export interface ICategoryDocument extends ICommonFields, ICategory, Document {
  _id: string;
}
export interface ICourseDocument extends ICommonFields, ICourse, Document {
  _id: string;
}

export interface IChapterDocument extends ICommonFields, IChapter, Document {
  _id: string;
}

export interface ILessonDocument extends ICommonFields, ILesson, Document {
  _id: string;
}

export interface IChapter {
  name: string;
  courseId?: string;
  contentIds?: string[];
  set_new_lessons_to_draft?: boolean;
}

export interface ILesson {
  title?: string;
  summary?: string;
  content?: string;
  status?: string;
  chapterId?: string;
  courseId?: string;
  type?: string;

  // forms?: IFormCodes[];
}

export interface IModels {
  // KnowledgeBaseArticles: IArticleModel;
  LmsCategories: ICategoryModel;
  LmsTopics: ITopicModel;
  LmsChapters: IChapterModel;
  LmsLessons: ILessonModel;
  LmsCourses: ICourseModel;
}

export const topicSchema = new Schema({
  _id: field({ pkey: true }),
  description: field({
    type: String,
    optional: true,
    label: 'Description'
  }),
  categoryIds: field({
    type: [String],
    required: false,
    label: 'Categories'
  }),
  color: field({ type: String, optional: true, label: 'Color' }),
  backgroundImage: field({
    type: String,
    optional: true,
    label: 'Background image'
  }),
  title: field({
    type: String,
    optional: true,
    label: 'title'
  })
});

export const categorySchema = new Schema({
  _id: field({ pkey: true }),
  description: field({ type: String, optional: true, label: 'Description' }),
  courseIds: field({ type: [String], label: 'Course' }),
  parentCategoryId: field({
    type: String,
    optional: true,
    label: 'Parent category'
  }),
  ...commonFields
});

export const courseSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, optional: true, label: 'name' }),
  categoryId: field({ type: String, label: 'categoryId' }),
  ...commonFields
});

export const chapterSchema = new Schema({
  _id: field({ pkey: true }),
  name: field({ type: String, optional: true, label: 'name' }),
  lessonIds: field({ type: [String], label: 'lessonId' }),
  courseId: field({ type: String, optional: true, label: 'Course' }),
  ...commonFields
});

export const lessonSchema = new Schema({
  _id: field({ pkey: true }),
  summary: field({ type: String, optional: true, label: 'Summary' }),
  content: field({ type: String, label: 'Content' }),
  status: field({
    type: String,
    enum: PUBLISH_STATUSES.ALL,
    default: PUBLISH_STATUSES.DRAFT,
    label: 'Status'
  }),
  // reactionChoices: field({
  //   type: [String],
  //   default: [],
  //   label: 'Reaction choices'
  // }),
  type: field({ type: String, label: 'type' }),
  viewCount: field({
    type: Number,
    default: 0,
    label: 'Count how many times visitor viewed'
  }),
  image: field({ type: attachmentSchema, label: 'Thumbnail image' }),
  attachments: field({ type: [attachmentSchema], label: 'Attachments' }),
  // reactionCounts: field({ type: Object, label: 'Reaction counts' }),
  courseId: field({ type: String, optional: true, label: 'Course' }),
  chapterId: field({ type: String, optional: true, label: 'Chapter' }),
  categoryId: field({ type: String, optional: true, label: 'category' }),

  // forms: field({ type: [formcodesSchema], label: 'Forms' }),
  ...commonFields
});
