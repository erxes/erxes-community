import { isEnabled } from '@erxes/ui/src/utils/core';

const brands = `
  query brands {
    brands {
      _id
      name
      code
      description
    }
  }
`;

const integrationTotalCount = `
  query totalIntegrationsCount {
    integrationsTotalCount {
      total
      byKind
    }
  }
`;

const integrationsGetConfigs = `
  query integrationsGetConfigs {
    integrationsGetConfigs
  }
`;

const integrationsGetIntegrationDetail = `
  query integrationsGetIntegrationDetail($erxesApiId: String) {
    integrationsGetIntegrationDetail(erxesApiId: $erxesApiId)
  }
`;

const integrationsGetAccounts = `
  query integrationsGetAccounts($kind: String) {
    integrationsGetAccounts(kind: $kind)
  }
`;

const integrationsGetIntegrations = `
  query integrationsGetIntegrations($kind: String) {
    integrationsGetIntegrations(kind: $kind)
  }
`;

const integrationsGetTwitterAccount = `
  query integrationsGetTwitterAccount($accountId: String!) {
    integrationsGetTwitterAccount(accountId: $accountId)
  }
`;

export default {
  brands,
  integrationTotalCount,
  integrationsGetConfigs,
  integrationsGetIntegrationDetail,
  integrationsGetAccounts,
  integrationsGetIntegrations,
  integrationsGetTwitterAccount
};
