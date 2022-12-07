module.exports = {
  name: "pricing",
  port: 3023,
  scope: "pricing",
  exposes: {
    "./routes": "./src/routes.tsx"
  },
  routes: {
    url: "http://localhost:3023/remoteEntry.js",
    scope: "pricing",
    module: "./routes"
  },
  menus: [
    {
      text: "Pricing",
      url: "/pricing/discounts",
      icon: 'icon-pricetag-alt',
      location: "mainNavigation",
      permission: 'showPricing'
    }
  ]
};
