module.exports = {
  name: "viber",
  scope: "viber",
  port: 3024,
  exposes: {
    "./routes": "./src/routes.tsx",
    "./inboxIntegrationForm": "./src/components/IntegrationForm.tsx",
    "./inboxConversationDetail": "./src/components/ConversationDetail.tsx",
    // './inboxConversationDetailRespondBoxMask': './src/components/conversation/RespondBox.tsx',
  },
  routes: {
    url: "http://localhost:3024/remoteEntry.js",
    scope: "viber",
    module: "./routes",
  },
  inboxIntegrationForm: "./inboxIntegrationForm",
  inboxConversationDetail: "./inboxConversationDetail",
  // inboxDirectMessage: {
  //   messagesQuery: {
  //     query: `
  //         query facebookConversationMessages(
  //           $conversationId: String!
  //           $skip: Int
  //           $limit: Int
  //           $getFirst: Boolean
  //         ) {
  //           facebookConversationMessages(
  //             conversationId: $conversationId,
  //             skip: $skip,
  //             limit: $limit,
  //             getFirst: $getFirst
  //           ) {
  //             _id
  //             content
  //             conversationId
  //             customerId
  //             userId
  //             createdAt
  //             isCustomerRead
  //             internal

  //             attachments {
  //               url
  //               name
  //               type
  //               size
  //             }

  //             user {
  //               _id
  //               username
  //               details {
  //                 avatar
  //                 fullName
  //                 position
  //               }
  //             }

  //             customer {
  //               _id
  //               avatar
  //               firstName
  //               middleName
  //               lastName
  //               primaryEmail
  //               primaryPhone
  //               state

  //               companies {
  //                 _id
  //                 primaryName
  //                 website
  //               }

  //               customFieldsData
  //               tagIds
  //             }
  //           }
  //         }
  //       `,
  //     name: 'facebookConversationMessages',
  //     integrationKind: 'facebook-messenger',
  //   },
  //   countQuery: {
  //     query: `
  //         query facebookConversationMessagesCount($conversationId: String!) {
  //           facebookConversationMessagesCount(conversationId: $conversationId)
  //         }
  //       `,
  //     name: 'facebookConversationMessagesCount',
  //     integrationKind: 'facebook-messenger',
  //   },
  // },
  inboxIntegrations: [
    {
      name: "Viber",
      description: "Configure Viber application",
      isAvailable: true,
      kind: "viber",
      logo: "/images/integrations/viber.png",
      createModal: "viber",
      components: ['inboxConversationDetail'],
    },
  ],
  // inboxConversationDetailRespondBoxMask: './inboxConversationDetail',
};
