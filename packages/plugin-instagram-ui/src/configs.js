module.exports = {
  name: 'instagram',
  scope: 'instagram',
  port: 3024,
  exposes: {
    './routes': './src/routes.tsx',
    './inboxIntegrationSettings': './src/components/IntegrationSettings.tsx',
    './inboxIntegrationForm': './src/components/IntegrationForm.tsx',
    './inboxConversationDetail': './src/components/ConversationDetail.tsx'
  },
  routes: {
    url: 'http://localhost:3024/remoteEntry.js',
    scope: 'instagram',
    module: './routes'
  },
  inboxIntegrationSettings: './inboxIntegrationSettings',
  inboxIntegrationForm: './inboxIntegrationForm',
  inboxConversationDetail: './inboxConversationDetail',
  inboxIntegrations: [{
    name: 'instagram',
    description:
      'Please write integration description on plugin config file',
    isAvailable: true,
    kind: 'instagram',
    logo: '/images/integrations/instagram.png',
    createModal: 'instagram',
  }]
};
