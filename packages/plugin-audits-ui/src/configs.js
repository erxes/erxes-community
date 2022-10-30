module.exports = {
  name: 'audits',
  port: 3017,
  scope: 'audits',
  exposes: {
    './routes': './src/routes.tsx',
    './dealSection': './src/riskAssessment/section/containers/List.tsx'
  },
  routes: {
    url: 'http://localhost:3017/remoteEntry.js',
    scope: 'audits',
    module: './routes'
  },
  menus: [
    {
      text: 'Audits',
      to: '/audits',
      image: '/images/icons/erxes-18.svg',
      location: 'settings',
      scope: 'audits'
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'riskAssessmentSection',
      component: './dealSection',
      scope: 'riskassessment'
    }
  ],
  ticketRightSidebarSection: [
    {
      text: 'riskAssessmentSection',
      component: './dealSection',
      scope: 'riskassessment'
    }
  ],
  taskRightSidebarSection: [
    {
      text: 'riskAssessmentSection',
      component: './dealSection',
      scope: 'riskassessment'
    }
  ]
};
