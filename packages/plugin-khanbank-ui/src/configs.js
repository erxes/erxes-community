module.exports = {
  name: 'khanbank',
  port: 3017,
  scope: 'khanbank',
  exposes: {
    './routes': './src/routes.tsx', 
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'khanbank',
    module: './routes',
  },
  menus: [
    {
      text: 'Khanbank',
      to: '/settings/khanbank',
      image: '/images/icons/erxes-25.png',
      location: 'settings',
      scope: 'khanbank',
    },
    {
      text: 'Khanbank',
      url: '/khanbank-corporate-gateway',
      icon: 'icon-dollar-alt',
      location: 'mainNavigation'
    },
    {
      text: 'Khanbank rates',
      url: '/khanbank-rates',
      scope: 'khanbank',
      icon: 'icon-dollar-alt',
      location: 'mainNavigation'
    }
  ]
};
