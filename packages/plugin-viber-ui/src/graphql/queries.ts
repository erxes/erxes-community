const messages: string = `
query viberConversationMessages(
  $conversationId: String!
  $skip: Int
  $limit: Int
  $getFirst: Boolean
) {
  viberConversationMessages(
    conversationId: $conversationId,
    skip: $skip,
    limit: $limit,
    getFirst: $getFirst
  ) {
    _id
    content
    conversationId
    customerId
    userId
    createdAt
    isCustomerRead
    internal

    attachments {
      url
      name
      type
      size
    }

    user {
      _id
      username
      details {
        avatar
        fullName
        position
      }
    }

    customer {
      _id
      avatar
      firstName
      middleName
      lastName
      primaryEmail
      primaryPhone
      state

      companies {
        _id
        primaryName
        website
      }

      customFieldsData
      tagIds
    }
  }
}
`;

const accounts: string = `
  query viberAccounts {
    viberAccounts 
  }
`;

const viberIntegrationDetail: string = `
  query viberIntegrationDetail($integrationId: String!) {
    viberIntegrationDetail(integrationId: $integrationId) {
      _id
      token
    }
  }
`;

export default {
  messages,
  accounts,
  viberIntegrationDetail
};
