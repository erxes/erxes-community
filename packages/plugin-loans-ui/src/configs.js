module.exports = {
  name: 'loans',
  port: 3119,
  exposes: {
    './routes': './src/routes.tsx',
    // './settings': './src/Settings.tsx',
    './contractSection': './src/contracts/components/common/ContractSection.tsx'
  },
  routes: {
    url: 'http://localhost:3119/remoteEntry.js',
    scope: 'loans',
    module: './routes'
  },
  menus: [
    {
      text: 'Contracts',
      url: '/erxes-plugin-loan/contract-list',
      icon: 'icon-medal',
      location: 'mainNavigation',
      permissions: ['manageContracts']
    },
    {
      text: 'Contract types',
      image: '/images/icons/erxes-01.svg',
      to: '/erxes-plugin-loan/contract-types/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['manageContracts']
    },
    {
      text: 'Insurance types',
      image: '/images/icons/erxes-13.svg',
      to: '/erxes-plugin-loan/insurance-types/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['manageInsuranceTypes']
    },
    {
      text: 'Loan config',
      image: '/images/icons/erxes-16.svg',
      to: '/erxes-plugin-loan/holiday-settings/',
      action: 'loanConfig',
      scope: 'loans',
      location: 'settings',
      permissions: ['manageContracts']
    },
    {
      text: 'Transaction',
      image: '/images/icons/erxes-16.svg',
      to: '/erxes-plugin-loan/transaction-list',
      action: 'transaction',
      scope: 'loans',
      location: 'transaction-list',
      permissions: ['manageTransactions']
    }
  ],
  customerRightSidebarSection: [
    {
      text: 'customerRightSidebarSection',
      component: './contractSection',
      scope: 'loans'
    }
  ],
  companyRightSidebarSection: [
    {
      text: 'companyRightSidebarSection',
      component: './contractSection',
      scope: 'loans'
    }
  ],
  dealRightSidebarSection: [
    {
      text: 'dealRightSidebarSection',
      component: './contractSection',
      scope: 'loans'
    }
  ]
};
