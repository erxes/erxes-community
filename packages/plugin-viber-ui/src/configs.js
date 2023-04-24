module.exports = {
  name: 'viber',
  scope: 'viber',
  port: 3024,
  exposes: {
    './routes': './src/routes.tsx',
    './inboxIntegrationSettings': './src/components/IntegrationSettings.tsx',
    './inboxIntegrationForm': './src/components/IntegrationForm.tsx',
    './inboxConversationDetail': './src/components/ConversationDetail.tsx'
  },
  routes: {
    url: 'http://localhost:3024/remoteEntry.js',
    scope: 'viber',
    module: './routes'
  },
  inboxIntegrationSettings: './inboxIntegrationSettings',
  inboxIntegrationForm: './inboxIntegrationForm',
  inboxConversationDetail: './inboxConversationDetail',
  inboxIntegrations: [{
    name: 'Viber',
    description:
      'Please write integration description on plugin config file',
    isAvailable: true,
    kind: 'viber',
    logo: '/images/integrations/viber.png',
    createModal: 'viber',
  }]
};
