const lmsChapterCommonParamsDef = `$doc: LmsChapterDoc!`;
const lmsLessonCommonParamsDef = `$doc: LmsLessonDoc!`;

const lmsChapterAdd = `
  mutation LmsChapterAdd(${lmsChapterCommonParamsDef}) {
    lmsChapterAdd(doc: $doc) {
      _id
      name
      createdBy
      createdDate
      modifiedBy
      modifiedDate
      courseId
      contentIds
  }
}
`;
const lmsChapterEdit = `
  mutation LmsChapterEdit($id: String!, ${lmsChapterCommonParamsDef}) {
  lmsChapterEdit(_id: $id, doc: $doc) {
    _id
    name
    createdBy
    createdDate
    modifiedBy
    modifiedDate
    courseId
    contentIds
  }
}
`;
const lmsLessonEdit = `
mutation LmsLessonEdit($id: String!, ${lmsLessonCommonParamsDef}) {
  lmsLessonEdit(_id: $id, doc: $doc) {
    _id
    title
    summary
    content
    status
    createdBy
 
    createdDate
    modifiedBy
    modifiedDate
    attachments {
      duration
      name
      size
      type
      url
    }
    categoryId
    chapterId
    courseId
    createdUser {
      _id
      createdAt
      username
      email
    }
    image {
      url
      name
      type
      size
      duration
    }
    viewCount
  }
}`;

const lmsLessonAdd = `mutation LmsLessonAdd($doc: LmsLessonDoc!) {
  lmsLessonAdd(doc: $doc) {
    _id
    title
    summary
    content
    status
    createdBy
    
    createdDate
    modifiedBy
    modifiedDate
    chapterId
    categoryId
    courseId
    viewCount
   
  }
}`;

const lmsLessonRemove = `mutation LmsLessonRemove($id: String!) {
  lmsLessonRemove(_id: $id)
}`;

const lmsCourseAdd = `mutation LmsCourseAdd($doc: LmsCourseDoc!) {
  lmsCourseAdd(doc: $doc) {
    _id
    name
    title
    createdBy
    createdDate
    modifiedBy
    modifiedDate
    categoryId
  }
}`;

const lmsCourseEdit = `
mutation LmsCourseEdit($id: String!, $doc: LmsCourseDoc!) {
  lmsCourseEdit(_id: $id, doc: $doc) {
    _id
    name
    title
    createdBy
    createdDate
    modifiedBy
    modifiedDate
    categoryId
  }
}`;

export default {
  lmsChapterAdd,
  lmsChapterEdit,
  lmsLessonAdd,
  lmsLessonEdit,
  lmsLessonRemove,

  lmsCourseAdd,
  lmsCourseEdit
};
