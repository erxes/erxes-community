module.exports = {
  name: 'telegram',
  scope: 'telegram',
  port: 3024,
  exposes: {
    './routes': './src/routes.tsx',
    './inboxIntegrationSettings': './src/components/IntegrationSettings.tsx',
    './inboxConversationDetail': './src/components/ConversationDetail.tsx'
  },
  routes: {
    url: 'http://localhost:3024/remoteEntry.js',
    scope: 'telegram',
    module: './routes'
  },
  inboxIntegrationSettings: './inboxIntegrationSettings',
  inboxConversationDetail: './inboxConversationDetail',
  inboxIntegration: {
    name: 'Telegram',
    description:
      'Please write integration description on plugin config file',
    isAvailable: true,
    kind: 'telegram',
    logo: '/images/integrations/telegram.png',
    createUrl: '/settings/integrations/createTelegram'
  }
};
