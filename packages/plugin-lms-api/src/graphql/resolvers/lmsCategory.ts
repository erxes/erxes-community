import { IContext } from '../../connectionResolver';
import { ICategoryDocument } from '../../models/definitions/lms';

export default {
  courses(category: ICategoryDocument, _args, { models }: IContext) {
    console.log('***********category***********:', category);
    return models.LmsCourses.find({ categoryId: category._id }).sort({
      name: 1
    });
  }
};
