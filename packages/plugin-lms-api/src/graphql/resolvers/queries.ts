import { paginate } from '@erxes/api-utils/src/core';
import { IContext } from '../../connectionResolver';

const queries = {
  /**
   * Topic list
   */
  lmsTopics(
    _root,
    args: { page: number; perPage: number; brandId: string },
    { commonQuerySelector, models }: IContext
  ) {
    const topics = models.LmsTopics.find({
      ...(args.brandId ? { brandId: args.brandId } : {}),
      ...commonQuerySelector
    }).sort({ modifiedDate: -1 });

    return paginate(topics, args);
  },

  /**
   * Topic detail
   */
  lmsTopicDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.LmsTopics.findOne({ _id });
  },

  /**
   * Total topic count
   */
  lmsTopicsTotalCount(_root, _args, { commonQuerySelector, models }: IContext) {
    return models.LmsTopics.find(commonQuerySelector).countDocuments();
  },

  //categories queries
  async lmsCategories(
    _root,
    {
      page,
      perPage,
      topicIds
    }: { page: number; perPage: number; topicIds: string[] },
    { commonQuerySelector, models }: IContext
  ) {
    // topicId: { $in: topicIds },
    console.log('hey categories called');
    const categories = models.LmsCategories.find({
      ...commonQuerySelector
    }).sort({
      title: 1
    });

    if (!page && !perPage) {
      return categories;
    }
    console.log('categories queries called', categories);
    return paginate(categories, { page, perPage });
  },

  /**
   * Category detail
   */
  lmsCategoryDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.LmsCategories.findOne({ _id }).then(category => {
      return category;
    });
  },

  /**
   * Category total count
   */
  async lmsCategoriesTotalCount(
    _root,
    args: { topicIds: string[] },
    { models }: IContext
  ) {
    return models.LmsCategories.find({
      topicId: { $in: args.topicIds }
    }).countDocuments();
  },

  /**
   * Get last category
   */
  lmsCategoriesGetLast(
    _root,
    _args,
    { commonQuerySelector, models }: IContext
  ) {
    return models.LmsCategories.findOne(commonQuerySelector).sort({
      createdDate: -1
    });
  },

  //chapter queries
  async lmsChapters(
    _root,
    {
      page,
      perPage,
      courseId
    }: { page: number; perPage: number; courseId: string[] },
    { models }: IContext
  ) {
    const chapters = models.LmsChapters.find({
      courseId
    }).sort({
      createdDate: 1
    });
    if (!page && !perPage) {
      return chapters;
    }
    console.log('chapters queries called', chapters);
    return paginate(chapters, { page, perPage });
  },

  /**
   * Category detail
   */
  lmsChapterDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.LmsChapters.findOne({ _id }).then(chapter => {
      return chapter;
    });
  },

  //lesson queries
  async lmsLessons(
    _root,
    {
      page,
      perPage,
      chapterId
    }: { page: number; perPage: number; chapterId: string[] },
    { models }: IContext
  ) {
    const lessons = models.LmsLessons.find({
      chapterId
    }).sort({
      createdDate: 1
    });

    if (!page && !perPage) {
      return lessons;
    }
    console.log('lessons queries called', lessons);
    return paginate(lessons, { page, perPage });
  },

  /**
   * Lesson detail
   */
  lmsLessonDetail(_root, { _id }: { _id: string }, { models }: IContext) {
    return models.LmsLessons.findOne({ _id }).then(lesson => {
      return lesson;
    });
  },
  //course queries
  async lmsCourses(
    _root,
    {
      page,
      perPage,
      categoryId
    }: { page: number; perPage: number; categoryId: string },
    { models }: IContext
  ) {
    const courses = models.LmsCourses.find({
      categoryId
    }).sort({
      createdDate: 1
    });

    if (!page && !perPage) {
      return courses;
    }
    console.log('courses queries called', courses);
    return paginate(courses, { page, perPage });
  }
};

export default queries;
