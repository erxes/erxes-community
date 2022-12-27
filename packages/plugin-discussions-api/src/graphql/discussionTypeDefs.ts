export const types = `
  extend type ClientPortalUser @key(fields: "_id") {
    _id: String! @external
  }

  type DiscussionQuestionWithAnswer {
    question: String
    answeredUsers: [ClientPortalUser]
  }

  type DiscussionCurrentUserVote {
    isUp: Boolean
    answer: String
  }

  type Discussion {
    _id: String!

    createdAt: Date
    createdUserId: String

    title: String
    content: String
    attachments: [JSON]
    tags: [String]
    questions: [String]

    currentUserVote: DiscussionCurrentUserVote
    questionsWithAnswer: [DiscussionQuestionWithAnswer]

    comments: [DiscussionComment]
  }

  type DiscussionVote {
    _id: String!

    createdAt: Date
    createdUserId: String

    discussionId: String
    isUp: Boolean
    answer: String
  }

  type DiscussionComment {
    _id: String!

    createdAt: Date
    createdUserId: String

    discussionId: String
    parentId: String
    content: String
  }
`;

const params = `
  limit: Int,
  page: Int,
  perPage: Int,
`;

export const queries = `
  discussions(${params}): [Discussion]
  discussionsDetail(_id: String!): Discussion
`;

export const mutations = `
  discussionsSave(_id: String, title: String!, content: String!, attachments: [JSON], tags: [String], questions: [String]): Discussion
  discussionsRemove(_id: String!): JSON
  discussionsVote(discussionId: String!, isUp: Boolean, answer: String): DiscussionVote
  discussionsComment(discussionId: String!, content: String!, parentId: String): DiscussionComment
`;
