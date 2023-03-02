module.exports = {
  name: 'kbcgw',
  port: 3017,
  scope: 'kbcgw',
  exposes: {
    './routes': './src/routes.tsx',
    './extendSystemConfig': './src/modules/config/components/Config.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'kbcgw',
    module: './routes',
  },
  extendSystemConfig: './extendSystemConfig',
  menus: [
    {
      text: 'Khanbank Corporate Gateway',
      to: '/khanbank-corporate-gateway',
      image: '/images/icons/erxes-18.svg',
      location: 'settings',
      scope: 'kbcgw',
    },
  ],
};
