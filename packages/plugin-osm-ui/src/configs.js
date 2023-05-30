module.exports = {
  name: 'osm',
  port: 3017,
  scope: 'osm',
  exposes: {
    './routes': './src/routes.tsx',
    './osmap': './src/containers/Map.tsx'
  },

  osMap: './osmap',

  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'osm',
    module: './routes'
  },
  menus:[{"text":"Osms","to":"/osms","image":"/images/icons/erxes-18.svg","location":"settings","scope":"osm"}]
};
