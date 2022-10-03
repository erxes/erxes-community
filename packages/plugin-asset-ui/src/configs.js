module.exports = {
  name: 'asset',
  port: 3012,
  scope: 'asset',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3012/remoteEntry.js',
    scope: 'asset',
    module: './routes'
  },
  menus: [
    {
      text: 'Assets',
      to: '/settings/asset-movements/',
      image: '/images/icons/erxes-18.svg',
      location: 'settings',
      scope: 'asset'
    },
    {
      text: 'Asset & Movements',
      url: '/asset-movements',
      icon: 'icon-piggybank',
      location: 'mainNavigation'
    }
  ]
};
