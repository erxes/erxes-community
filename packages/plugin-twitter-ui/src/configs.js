module.exports = {
  name: 'twitter',
  scope: 'twitter',
  port: 3015,
  exposes: {
    './routes': './src/routes.tsx',
    './inboxIntegrationTwitterSettings':
      './src/components/IntegrationSettings.tsx',
    './inboxIntegrationTwitterForm': './src/components/Twitter.tsx',
    './inboxConversationDetail': './src/components/Twitter.tsx'
  },
  routes: {
    url: 'http://localhost:3015/remoteEntry.js',
    scope: 'twitter',
    module: './routes'
  },
  inboxIntegrationTwitterSettings: './inboxIntegrationTwitterSettings',
  inboxIntegrationTwitterForm: './inboxIntegrationTwitterForm',
  inboxConversationDetail: './inboxConversationDetail',
  inboxIntegration: {
    name: 'TWITTER',
    description: '',
    inMessenger: false,
    isAvailable: true,
    kind: 'twitter',
    logo: '/images/integrations/twitter.png',
    createModal: 'twitter',
    createUrl: '/settings/integrations/twitter',
    category:
      'All integrations, For support teams, Marketing automation, Email marketing'
  }
};
