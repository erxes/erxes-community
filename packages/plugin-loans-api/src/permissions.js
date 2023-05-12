module.exports = {
  loans: {
    name: 'loans',
    description: 'Loans',
    actions: [
      {
        name: 'loansAll',
        description: 'All Loan',
        use: [
          'contractsAdd',
          'contractsEdit',
          'contractsDealEdit',
          'contractsClose',
          'contractsRemove',
          'showContracts',
          'manageSchedule',
          'showCollaterals',
          'manageTransactions',
          'showTransactions',
          'transactionsRemove',
          'showPeriodLocks',
          'managePeriodLocks',
          'manageInsuranceTypes',
          'manageInvoices',
          'showInvoices'
        ]
      },
      {
        name: 'loansContractsAll',
        description: 'Manage All Loan Contracts',
        use: [
          'contractsAdd',
          'contractsEdit',
          'contractsDealEdit',
          'contractsClose',
          'contractsRemove',
          'showContracts',
          'manageSchedule',
          'showCollaterals'
        ]
      },
      {
        name: 'loansTransactionsAll',
        description: 'Manage All Loan Transaction',
        use: ['manageTransactions', 'showTransactions', 'transactionsRemove']
      },
      {
        name: 'loansPeriodLocksAll',
        description: 'Manage All Period Locks',
        use: ['showPeriodLocks', 'managePeriodLocks']
      },
      //#region contract
      {
        name: 'contractsAdd',
        description: 'Contract Add'
      },
      {
        name: 'contractsEdit',
        description: 'Contract Edit'
      },
      {
        name: 'contractsDealEdit',
        description: 'Contract Deal Relation'
      },
      {
        name: 'contractsClose',
        description: 'Close Contract'
      },
      {
        name: 'contractsRemove',
        description: 'Delete Contract'
      },
      {
        name: 'showContracts',
        description: 'Show Contracts'
      },
      {
        name: 'manageSchedule',
        description: 'Manage Schedule'
      },
      {
        name: 'showCollaterals',
        description: 'Show Collaterals'
      },
      //#endregion
      //insurance
      {
        name: 'manageInsuranceTypes',
        description: 'Manage Insurance Config'
      },
      {
        name: 'manageInvoices',
        description: 'Manage Invoices'
      },
      {
        name: 'showInvoices',
        description: 'Show Invoices'
      },
      //transaction
      {
        name: 'manageTransactions',
        description: 'Manage Transaction'
      },
      {
        name: 'showTransactions',
        description: 'Show Transactions'
      },
      {
        name: 'transactionsRemove',
        description: 'Remove Transactions'
      },
      //period Lock
      {
        name: 'showPeriodLocks',
        description: 'Show Period Locks'
      },
      {
        name: 'managePeriodLocks',
        description: 'Manage Period Locks'
      }
    ]
  }
};
