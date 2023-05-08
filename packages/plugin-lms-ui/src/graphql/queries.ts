const categoryFields = `
  _id
  title
  description
  icon
`;

const lessonFields = `
  _id
  title
  description
  type
`;

const lmsCategories = `
  query objects($page: Int, $perPage: Int) {
    lmsCategories(page: $page, perPage: $perPage ) {
      ${categoryFields}
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      parentCategoryId
      courses{
        _id
        name
      }
    }
  }
`;

const lmsCourses = `
 query LmsCourses($page: Int, $perPage: Int, $categoryId: String) {
  lmsCourses(page: $page, perPage: $perPage, categoryId: $categoryId) {
    _id
    name
    title
    createdBy
    createdDate
    modifiedBy
    modifiedDate
    categoryId
  }
}
`;

const knowledgeBaseTopics = `
  query knowledgeBaseTopics($page: Int, $perPage: Int) {
    knowledgeBaseTopics(page: $page, perPage: $perPage) {
      _id
      title
      description
      brand {
        _id
        name
      }
      categories {
        ${categoryFields}
      }
      color
      backgroundImage
      languageCode
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      notificationSegmentId

      parentCategories {
        ${categoryFields}
      }
    }
  }
`;

const knowledgeBaseTopicsTotalCount = `
  query knowledgeBaseTopicsTotalCount {
    knowledgeBaseTopicsTotalCount
  }
`;

const getBrandList = `
  query brands {
    brands {
      _id
      name
    }
  }
`;

const knowledgeBaseCategories = `
  query objects($page: Int, $perPage: Int, $topicIds: [String]) {
    knowledgeBaseCategories(page: $page, perPage: $perPage, topicIds: $topicIds ) {
      ${categoryFields}
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      parentCategoryId
      articles {
        _id
        title
      }
    }
  }
`;

const knowledgeBaseCategoryDetail = `
  query knowledgeBaseCategoryDetail($_id: String!) {
    knowledgeBaseCategoryDetail(_id: $_id) {
      ${categoryFields}
      articles {
        _id
        title
        summary
        content
        status
      }
      firstTopic {
        _id
        title
      }
    }
  }
`;

const knowledgeBaseCategoriesTotalCount = `
  query knowledgeBaseCategoriesTotalCount($topicIds: [String]) {
    knowledgeBaseCategoriesTotalCount(topicIds: $topicIds)
  }
`;

const categoriesGetLast = `
  query knowledgeBaseCategoriesGetLast {
    knowledgeBaseCategoriesGetLast {
      _id
      firstTopic {
        _id
        title
      }
    }
  }
`;

const knowledgeBaseArticlesTotalCount = `
  query knowledgeBaseArticlesTotalCount($categoryIds: [String]) {
    knowledgeBaseArticlesTotalCount(categoryIds: $categoryIds)
  }
`;

const lmsChapters = `
  query lmsChapters($page: Int, $perPage: Int, $courseId: String) {
    lmsChapters(page: $page, perPage: $perPage, courseId: $courseId) {
      _id
      name,
      courseId,
      contentIds,
      createdBy
      createdDate
      modifiedBy
      modifiedDate
    }
  }
`;

const lmsLessons = `
  query lmsLessons($page: Int, $perPage: Int, $chapterId: String) {
    lmsLessons(page: $page, perPage: $perPage, chapterId: $chapterId) {
     _id
      title
      summary
      content
      status
      createdBy
      courseId
      categoryId
      chapterId
      createdUser {
        _id
        username
        email
        details {
          avatar
          fullName
        }
      }
      attachments {
        name
        url
        type
        size
        duration
      }
      image {
        name
        url
        type
        size
      }
      createdDate
      modifiedBy
      modifiedDate
    }
  }
`;

const lmsLessonDetail = `
  query LmsLessonDetail($id: String!) {
    lmsLessonDetail(_id: $id) {
      _id
      title
      summary
      content
      status
      createdBy
      categoryId
      createdUser {
        _id
        username
        email
        details {
          avatar
          fullName
        }
      }
      attachments {
        name
        url
        type
        size
        duration
      }
      image {
        name
        url
        type
        size
      }
      createdDate
      modifiedBy
      modifiedDate
    }
  }
`;

export default {
  getBrandList,
  categoriesGetLast,
  knowledgeBaseTopics,
  knowledgeBaseTopicsTotalCount,
  knowledgeBaseCategories,
  knowledgeBaseCategoryDetail,
  knowledgeBaseCategoriesTotalCount,
  knowledgeBaseArticlesTotalCount,
  lmsChapters,
  lmsLessons,
  lmsCategories,
  lmsLessonDetail,
  lmsCourses
};
