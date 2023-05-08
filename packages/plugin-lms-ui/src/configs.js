module.exports = {
  name: 'lms',
  port: 3017,
  scope: 'lms',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'lms',
    module: './routes'
  },
  menus: [
    {
      text: 'Lms',
      url: '/lms',
      icon: 'icon-star',
      location: 'mainNavigation'
    }
  ]
};
