import { gql } from 'apollo-server-express';
import {
  attachmentInput,
  attachmentType
} from '@erxes/api-utils/src/commonTypeDefs';

const types = `

  ${attachmentType}
  ${attachmentInput}
  
  extend type User @key(fields: "_id") {
        _id: String! @external
      }
      
  type Lms {
    _id: String!
    title: String
    mailData: JSON
  }

  input LmsTopicDoc {
    title: String!
    description: String
    categoryIds: [String]
    color: String
    backgroundImage: String
  },

  type LmsCategory {
    _id: String
    title: String
    description: String
 
    icon: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    parentCategoryId: String

    firstTopic: LmsTopic
    numOfArticles: Float

    courses: [LmsCourse]
  }

   type LmsTopic @key(fields: "_id"){
    _id: String!
    title: String
    description: String
    color: String
    backgroundImage: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
  },


  input LmsCategoryDoc {
    title: String!
    description: String
    articleIds: [String]
    icon: String!
    topicIds: [String],
    topicId: String,
    parentCategoryId: String
  }

  input LmsChapterDoc {
    name: String!
    contentIds: [String]
    courseId: String,
  }
   type LmsChapter {
    _id: String
    name: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    courseId: String
    contentIds: [String]
  }

   input LmsLessonDoc {
    title: String!
    summary: String
    content: String!
    status: String!
    courseId: String
    chapterId: String
    categoryId: String
    image: AttachmentInput
    attachments: [AttachmentInput]

  }

    input LmsCourseDoc {
    name: String!
    categoryId: String
  }
     type LmsCourse {
    _id: String
    name: String
    title: String
    createdBy: String
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    categoryId: String
  }

  type LmsLesson @key(fields: "_id") {
    _id: String!
    title: String
    summary: String
    content: String
    status: String
    createdBy: String
    createdUser: User
    createdDate: Date
    modifiedBy: String
    modifiedDate: Date
    chapterId: String
    categoryId: String
    courseId: String
    viewCount: Int
    attachments: [Attachment]
    image: Attachment
  }
`;

const queries = `
  lmsTopics(page: Int, perPage: Int, brandId: String): [LmsTopic]
  lmsTopicDetail(_id: String!): LmsTopic
  lmsTopicsTotalCount: Int

  lmsCategories(page: Int, perPage: Int, topicIds: [String]): [LmsCategory],
  lmsCategoryDetail(_id: String!): LmsCategory,
  lmsCategoriesTotalCount(topicIds: [String]): Int
  lmsCategoriesGetLast: LmsCategory

  lmsChapters(page: Int, perPage: Int, courseId: String): [LmsChapter],
  lmsChapterDetail(_id: String!): LmsChapter,

  lmsLessons(page: Int, perPage: Int, chapterId: String): [LmsLesson],
  lmsLessonDetail(_id: String!): LmsLesson,

   lmsCourses(page: Int, perPage: Int, categoryId: String): [LmsCourse],
`;

const mutations = `
  lmsTopicAdd(doc: LmsTopicDoc!): LmsTopic,
  lmsTopicsEdit(_id: String!, doc: LmsTopicDoc!): LmsTopic
  lmsTopicsRemove(_id: String!): JSON

  lmsCategoriesAdd(doc: LmsCategoryDoc!): LmsCategory
  lmsCategoriesEdit(_id: String!, doc: LmsCategoryDoc!): LmsCategory
  lmsCategoriesRemove(_id: String!): JSON

  lmsChapterAdd(doc: LmsChapterDoc!): LmsChapter
  lmsChapterEdit(_id: String!, doc: LmsChapterDoc!): LmsChapter
  lmsChapterRemove(_id: String!): JSON

  lmsLessonAdd(doc: LmsLessonDoc!): LmsLesson
  lmsLessonEdit(_id: String!, doc: LmsLessonDoc!): LmsLesson
  lmsLessonRemove(_id: String!): JSON

  lmsCourseAdd(doc: LmsCourseDoc!): LmsCourse
  lmsCourseEdit(_id: String!, doc: LmsCourseDoc!): LmsCourse
  lmsCourseRemove(_id: String!): JSON
`;

const typeDefs = gql`
  scalar JSON
  scalar Date

  ${types}

  extend type Query {
    ${queries}
  }

  extend type Mutation {
    ${mutations}
  }
`;

export default typeDefs;
