import { Schema, model, Model } from 'mongoose';
import {
  categorySchema,
  chapterSchema,
  courseSchema,
  ICategory,
  ICategoryDocument,
  IChapter,
  IChapterDocument,
  ICourse,
  ICourseDocument,
  ILesson,
  ILessonDocument,
  IModels,
  ITopic,
  ITopicDocument,
  lessonSchema,
  topicSchema
} from './definitions/lms';

export interface ICategoryCreate extends ICategory {
  userId?: string;
}
export interface ICourseCreate extends ICourse {
  userId?: string;
}

export interface IChapterCreate extends IChapter {
  userId?: string;
}
export interface ILessonCreate extends ILesson {
  userId?: string;
  icon?: string;
  modifiedBy?: string;
}

export interface ICategoryModel extends Model<ICategoryDocument> {
  getCategory(_id: string): Promise<ICategoryDocument>;
  createDoc(
    docFields: ICategoryCreate,
    userId?: string
  ): Promise<ICategoryDocument>;
  updateDoc(
    _id: string,
    docFields: ICategoryCreate,
    userId?: string
  ): Promise<ICategoryDocument>;
  removeDoc(categoryId: string): void;
}

export interface ICourseModel extends Model<ICourseDocument> {
  getCourse(_id: string): Promise<ICourseDocument>;
  createDoc(
    docFields: ICourseCreate,
    userId?: string
  ): Promise<ICourseDocument>;
  updateDoc(
    _id: string,
    docFields: ICourseCreate,
    userId?: string
  ): Promise<ICourseDocument>;
  removeDoc(courseId: string): void;
}

export interface ITopicModel extends Model<ITopicDocument> {
  getTopic(_id: string): Promise<ITopicDocument>;
  createDoc(docFields: ITopic, userId?: string): Promise<ITopicDocument>;
  updateDoc(
    _id: string,
    docFields: ITopic,
    userId?: string
  ): Promise<ITopicDocument>;
  removeDoc(_id: string): void;
}

export interface IChapterModel extends Model<IChapterDocument> {
  getChapter(_id: string): Promise<IChapterDocument>;
  createDoc(
    docFields: IChapterCreate,
    userId?: string
  ): Promise<IChapterDocument>;
  updateDoc(
    _id: string,
    docFields: IChapterCreate,
    userId?: string
  ): Promise<IChapterDocument>;
  removeDoc(chapterId: string): void;
}

export interface ILessonModel extends Model<ILessonDocument> {
  getLesson(_id: string): Promise<ILessonDocument>;
  createDoc(
    docFields: ILessonCreate,
    userId?: string
  ): Promise<ILessonDocument>;
  updateDoc(
    _id: string,
    docFields: ILessonCreate,
    userId?: string
  ): Promise<ILessonDocument>;
  removeDoc(lessonId: string): void;
}

export const loadTopicClass = (models: IModels) => {
  class Topic {
    public static async getTopic(_id: string) {
      const topic = await models.LmsTopics.findOne({ _id });

      if (!topic) {
        throw new Error('Knowledge base topic not found');
      }

      return topic;
    }

    public static async createDoc(docFields: ITopic, userId?: string) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }
      console.log('hhe', docFields);
      const result = await models.LmsTopics.create({
        ...docFields,
        createdDate: new Date(),
        createdBy: userId,
        modifiedDate: new Date()
      });

      console.log(result, 'result');

      return result;
    }

    /**
     * Update LmsTopic document
     */
    public static async updateDoc(
      _id: string,
      docFields: ITopic,
      userId?: string
    ) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      await models.LmsTopics.updateOne(
        { _id },
        {
          $set: {
            ...docFields,
            modifiedBy: userId,
            modifiedDate: new Date()
          }
        }
      );

      return models.LmsTopics.findOne({ _id });
    }

    /**
     * Removes LmsTopic document and it's children categories
     */
    public static async removeDoc(_id: string) {
      const topic = await models.LmsTopics.findOne({ _id });

      if (!topic) {
        throw new Error('Topic not found');
      }

      // remove child items ===========
      const categories = await models.LmsCategories.find({
        topicId: _id
      });

      for (const category of categories) {
        await models.LmsCategories.removeDoc(category._id);
      }

      return models.LmsCategories.deleteOne({ _id });
    }
  }

  topicSchema.loadClass(Topic);

  return topicSchema;
};

export const loadCategoryClass = (models: IModels) => {
  class Category {
    public static async getCategory(_id: string) {
      const category = await models.LmsCategories.findOne({ _id });

      if (!category) {
        throw new Error('Knowledge base category not found');
      }

      return category;
    }

    /**
     * Create LmsCategory document
     */
    public static async createDoc(docFields: ICategoryCreate, userId?: string) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      const category = await models.LmsCategories.create({
        ...docFields,
        createdDate: new Date(),
        createdBy: userId,
        modifiedDate: new Date()
      });

      return category;
    }

    /**
     * Update LmsCategory document
     */
    public static async updateDoc(
      _id: string,
      docFields: ICategoryCreate,
      userId?: string
    ) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      const parentId = docFields.parentCategoryId;

      if (parentId) {
        if (_id === parentId) {
          throw new Error('Cannot change category');
        }

        const childrenCounts = await models.LmsCategories.countDocuments({
          parentCategoryId: _id
        });

        if (childrenCounts > 0) {
          throw new Error('Cannot change category. this is parent tag');
        }
      }

      await models.LmsCategories.updateOne(
        { _id },
        {
          $set: {
            ...docFields,
            modifiedBy: userId,
            modifiedDate: new Date()
          }
        }
      );

      const category = await models.LmsCategories.getCategory(_id);

      return category;
    }

    /**
     * Removes LmsCategory document and it's children articles
     */
    public static async removeDoc(_id: string) {
      const category = await models.LmsCategories.findOne({ _id });

      if (!category) {
        throw new Error('Category not found');
      }

      //   await models.KnowledgeBaseArticles.deleteMany({
      //     categoryId: _id
      //   });

      return models.LmsCategories.deleteOne({ _id });
    }
  }

  categorySchema.loadClass(Category);

  return categorySchema;
};

export const loadCourseClass = (models: IModels) => {
  class Course {
    public static async getCourse(_id: string) {
      const course = await models.LmsCourses.findOne({ _id });

      if (!course) {
        throw new Error('Lms course not found');
      }

      return course;
    }

    /**
     * Create LmsCategory document
     */
    public static async createDoc(docFields: ICourseCreate, userId?: string) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      const course = await models.LmsCourses.create({
        ...docFields,
        createdDate: new Date(),
        createdBy: userId,
        modifiedDate: new Date()
      });

      return course;
    }

    /**
     * Update course document
     */
    public static async updateDoc(
      _id: string,
      docFields: ICourseCreate,
      userId?: string
    ) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      await models.LmsCourses.updateOne(
        { _id },
        {
          $set: {
            ...docFields,
            modifiedBy: userId,
            modifiedDate: new Date()
          }
        }
      );

      const course = await models.LmsCourses.getCourse(_id);
      return course;
    }

    /**
     * Removes LmsCategory document and it's children articles
     */
    public static async removeDoc(_id: string) {
      const course = await models.LmsCourses.findOne({ _id });

      if (!course) {
        throw new Error('Category not found');
      }

      //   await models.KnowledgeBaseArticles.deleteMany({
      //     categoryId: _id
      //   });

      return models.LmsCourses.deleteOne({ _id });
    }
  }

  courseSchema.loadClass(Course);

  return courseSchema;
};

export const loadChapterClass = (models: IModels) => {
  class Chapter {
    public static async getChapter(_id: string) {
      const chapters = await models.LmsChapters.findOne({ _id });

      if (!chapters) {
        throw new Error('Lms chapter not found');
      }

      return chapters;
    }

    /**
     * Create LmsChapter document
     */
    public static async createDoc(docFields: IChapterCreate, userId?: string) {
      console.log('14444');
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      const chapters = await models.LmsChapters.create({
        ...docFields,
        createdDate: new Date(),
        createdBy: userId,
        modifiedDate: new Date()
      });

      return chapters;
    }

    /**
     * Update LmsChapter document
     */
    public static async updateDoc(
      _id: string,
      docFields: IChapterCreate,
      userId?: string
    ) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      await models.LmsChapters.updateOne(
        { _id },
        {
          $set: {
            ...docFields,
            modifiedBy: userId,
            modifiedDate: new Date()
          }
        }
      );

      const chapter = await models.LmsChapters.getChapter(_id);

      return chapter;
    }

    /**
     * Removes LmsChapter document and it's children articles
     */
    public static async removeDoc(_id: string) {
      const chapter = await models.LmsChapters.findOne({ _id });

      if (!chapter) {
        throw new Error('Chapter not found');
      }

      //   await models.KnowledgeBaseArticles.deleteMany({
      //     categoryId: _id
      //   });

      return models.LmsChapters.deleteOne({ _id });
    }
  }

  chapterSchema.loadClass(Chapter);

  return chapterSchema;
};

export const loadLessonClass = (models: IModels) => {
  class Lesson {
    public static async getLesson(_id: string) {
      const lessons = await models.LmsLessons.findOne({ _id });

      if (!lessons) {
        throw new Error('Lms lessons not found');
      }

      return lessons;
    }

    /**
     * Create LmsLesson document
     */
    public static async createDoc(docFields: ILessonCreate, userId?: string) {
      console.log('14444');
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      const lessons = await models.LmsLessons.create({
        ...docFields,
        createdDate: new Date(),
        createdBy: userId,
        modifiedDate: new Date()
      });

      return lessons;
    }

    /**
     * Update LmsLesson document
     */
    public static async updateDoc(
      _id: string,
      docFields: ILessonCreate,
      userId?: string
    ) {
      if (!userId) {
        throw new Error('userId must be supplied');
      }

      await models.LmsLessons.updateOne(
        { _id },
        {
          $set: {
            ...docFields,
            modifiedBy: userId,
            modifiedDate: new Date()
          }
        }
      );

      const lessons = await models.LmsLessons.getLesson(_id);

      return lessons;
    }

    /**
     * Removes LmsLessons document
     */
    public static async removeDoc(_id: string) {
      const lesson = await models.LmsLessons.findOne({ _id });

      if (!lesson) {
        throw new Error('lesson not found');
      }

      //   await models.KnowledgeBaseArticles.deleteMany({
      //     categoryId: _id
      //   });

      return models.LmsLessons.deleteOne({ _id });
    }
  }

  lessonSchema.loadClass(Lesson);

  return lessonSchema;
};
