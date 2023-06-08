module.exports = {
  name: "viber",
  scope: "viber",
  port: 3024,
  exposes: {
    "./routes": "./src/routes.tsx",
    "./inboxIntegrationForm": "./src/components/IntegrationForm.tsx",
    "./inboxConversationDetail": "./src/components/ConversationDetail.tsx",
  },
  routes: {
    url: "http://localhost:3024/remoteEntry.js",
    scope: "viber",
    module: "./routes",
  },
  inboxIntegrationForm: "./inboxIntegrationForm",
  inboxConversationDetail: "./inboxConversationDetail",
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
};
