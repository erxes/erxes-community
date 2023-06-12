import { IContext } from '../../connectionResolver';
import { ITopic } from '../../models/definitions/lms';
import {
  ICategoryCreate,
  IChapterCreate,
  ICourseCreate,
  ILessonCreate
} from '../../models/lms';

const lmsMutations = {
  async lmsTopicAdd(
    _root,
    { doc }: { doc: ITopic },
    { user, docModifier, models, subdomain }: IContext
  ) {
    const result = await models.LmsTopics.createDoc(doc, user._id);
    console.log(result, 'resultresult');
    return result;
  },

  /**
   * Updates a topic document
   */
  async lmsTopicsEdit(
    _root,
    { _id, doc }: { _id: string; doc: ITopic },
    { user, models, subdomain }: IContext
  ) {
    const updated = await models.LmsTopics.updateDoc(_id, doc, user._id);
    return updated;
  },

  /**
   * Remove topic document
   */
  async lmsTopicsRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const removed = await models.LmsTopics.removeDoc(_id);
    return removed;
  },

  //categories mutations
  async lmsCategoriesAdd(
    _root,
    { doc }: { doc: ICategoryCreate },
    { user, models, subdomain }: IContext
  ) {
    const lmsCategory = await models.LmsCategories.createDoc(doc, user._id);
    return lmsCategory;
  },

  /**
   * Update category document
   */
  async lmsCategoriesEdit(
    _root,
    { _id, doc }: { _id: string; doc: ICategoryCreate },
    { user, models, subdomain }: IContext
  ) {
    const updated = await models.LmsCategories.updateDoc(_id, doc, user._id);

    return updated;
  },

  /**
   * Remove category document
   */
  async lmsCategoriesRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const kbCategory = await models.LmsCategories.getCategory(_id);

    await models.LmsCategories.updateMany(
      { parentCategoryId: { $in: [kbCategory._id] } },
      { $unset: { parentCategoryId: 1 } }
    );

    const removed = await models.LmsCategories.removeDoc(_id);

    return removed;
  },

  //chapters mutations

  async lmsChapterAdd(
    _root,
    { doc }: { doc: IChapterCreate },
    { user, models, subdomain }: IContext
  ) {
    console.log(doc, 'doc');
    const lmsCategory = await models.LmsChapters.createDoc(doc, user._id);
    return lmsCategory;
  },
  /**
   * Update category document
   */

  async lmsChapterEdit(
    _root,
    { _id, doc }: { _id: string; doc: IChapterCreate },
    { user, models, subdomain }: IContext
  ) {
    const updated = await models.LmsChapters.updateDoc(_id, doc, user._id);

    return updated;
  },

  /**
   * Remove chapter document
   */
  async lmsChapterRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const chapter = await models.LmsChapters.getChapter(_id);

    await models.LmsChapters.updateMany(
      { parentCategoryId: { $in: [chapter._id] } },
      { $unset: { parentCategoryId: 1 } }
    );

    const removed = await models.LmsChapters.removeDoc(_id);

    return removed;
  },

  //lessons mutations
  async lmsLessonAdd(
    _root,
    { doc }: { doc: ILessonCreate },
    { user, models, subdomain }: IContext
  ) {
    console.log(doc, 'doc');
    const lmsLesson = await models.LmsLessons.createDoc(doc, user._id);
    return lmsLesson;
  },
  /**
   * Update category document
   */

  async lmsLessonEdit(
    _root,
    { _id, doc }: { _id: string; doc: ILessonCreate },
    { user, models, subdomain }: IContext
  ) {
    const updated = await models.LmsLessons.updateDoc(_id, doc, user._id);

    return updated;
  },

  /**
   * Remove lesson document
   */
  async lmsLessonRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const lesson = await models.LmsLessons.getLesson(_id);

    await models.LmsLessons.updateMany(
      { parentCategoryId: { $in: [lesson._id] } },
      { $unset: { parentCategoryId: 1 } }
    );

    const removed = await models.LmsLessons.removeDoc(_id);

    return removed;
  },
  //courses mutations
  async lmsCourseAdd(
    _root,
    { doc }: { doc: ICourseCreate },
    { user, models, subdomain }: IContext
  ) {
    console.log(doc, 'doc');
    const lmsCourse = await models.LmsCourses.createDoc(doc, user._id);
    return lmsCourse;
  },
  /**
   * Update category document
   */

  async lmsCourseEdit(
    _root,
    { _id, doc }: { _id: string; doc: ICourseCreate },
    { user, models, subdomain }: IContext
  ) {
    const updated = await models.LmsCourses.updateDoc(_id, doc, user._id);

    return updated;
  },

  /**
   * Remove lesson document
   */
  async lmsCourseRemove(
    _root,
    { _id }: { _id: string },
    { user, models, subdomain }: IContext
  ) {
    const removed = await models.LmsCourses.removeDoc(_id);

    return removed;
  }
};

export default lmsMutations;
