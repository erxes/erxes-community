const commonVariables = `
  $title: String!
  $description: String
  $contentType: ContentType!
  $images: [JSON]
  $attachments: [JSON]
  $recipientIds: [String]
  $customFieldsData: JSON
  $eventData: ExmEventDataInput
  $createdAt: Date
  $department : String
`;

const commonParams = `
  title: $title
  description: $description
  contentType: $contentType
  images: $images
  attachments: $attachments
  recipientIds: $recipientIds
  customFieldsData: $customFieldsData
  eventData: $eventData
  createdAt: $createdAt
  department : $department
`;

const addFeed = `
  mutation addFeed(${commonVariables}) {
    exmFeedAdd(${commonParams}) {
      _id
    }
  }
`;

const editFeed = `
  mutation editFeed($_id: String! ${commonVariables}) {
    exmFeedEdit(_id: $_id ${commonParams}) {
      _id
    }
  }
`;

const pinFeed = `
  mutation pinFeed($_id: String) {
    exmFeedToggleIsPinned(_id: $_id)
  }
`;

const deleteFeed = `
  mutation deleteFeed($_id: String!) {
    exmFeedRemove(_id: $_id)
  }
`;

const thankCommonVariables = `
  $description: String!
  $recipientIds: [String]!
`;

const thankCommonParams = `
  description: $description
  recipientIds: $recipientIds
`;

const addThank = `
  mutation addThank(${thankCommonVariables}) {
    exmThankAdd(${thankCommonParams}) {
      _id
    }
  }
`;

const editThank = `
  mutation editThank($_id: String!, ${thankCommonVariables}) {
    exmThankEdit(_id: $_id, ${thankCommonParams}) {
      _id
    }
  }
`;

const deleteThank = `
  mutation deleteThank($_id: String!) {
    exmThankRemove(_id: $_id)
  }
`;

const chatAdd = `
  mutation chatAdd($name: String, $type: ChatType!, $participantIds: [String]) {
    chatAdd(name: $name, type: $type, participantIds: $participantIds) {
      _id
    }
  }
`;

const chatRemove = `
  mutation chatRemove($id: String!) {
    chatRemove(_id: $id)
  }
`;

const chatMarkAsRead = `
  mutation chatMarkAsRead($id: String!) {
    chatMarkAsRead(_id: $id)
  }
`;

const chatMessageAdd = `
  mutation chatMessageAdd($chatId: String!, $content: String!, $relatedId: String, $attachments: [JSON]) {
    chatMessageAdd(chatId: $chatId, content: $content, relatedId: $relatedId, attachments: $attachments) {
      _id
    }
  }
`;

export default {
  addFeed,
  editFeed,
  deleteFeed,
  addThank,
  editThank,
  deleteThank,
  pinFeed,
  chatAdd,
  chatRemove,
  chatMarkAsRead,
  chatMessageAdd,
};