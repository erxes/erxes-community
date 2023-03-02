module.exports = {
  name: 'khanbank',
  port: 3017,
  scope: 'khanbank',
  exposes: {
    './routes': './src/routes.tsx',
    // './extendSystemConfig': './src/modules/config/components/Config.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'khanbank',
    module: './routes',
  },
  // extendSystemConfig: './extendSystemConfig',
  menus: [
    {
      text: 'Khanbank Corporate Gateway',
      to: '/settings/khanbank',
      image: '/images/icons/erxes-18.svg',
      location: 'settings',
      scope: 'khanbank',
    },
  ],
};
