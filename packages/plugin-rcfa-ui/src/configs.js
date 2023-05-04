module.exports = {
  name: 'rcfa',
  port: 3030,
  scope: 'rcfa',
  exposes: {
    './routes': './src/routes.tsx'
  },
  routes: {
    url: 'http://localhost:3030/remoteEntry.js',
    scope: 'rcfa',
    module: './routes'
  },
  menus: [
    {
      text: 'RCFA',
      url: '/rcfa',
      icon: 'icon-file-question-alt',
      location: 'mainNavigation'
    }
  ]
};
