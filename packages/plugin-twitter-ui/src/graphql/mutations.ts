const integrationsCreateExternalIntegration = `
  mutation integrationsCreateExternalIntegration($name: String!, $brandId: String!, $accountId: String, $kind: String!,$channelIds: [String], $data: JSON) {
    integrationsCreateExternalIntegration(name: $name, brandId: $brandId, accountId: $accountId, kind: $kind, channelIds: $channelIds, data: $data) {
      _id
      brand {
        _id
        name
        code
      }
    }
  }
`;

const integrationsEditCommonFields = `
  mutation integrationsEditCommonFields($_id: String!, $name: String!, $brandId: String!, $channelIds: [String], $data: JSON) {
    integrationsEditCommonFields(_id: $_id, name: $name, brandId: $brandId, channelIds: $channelIds, data: $data) {
      _id
    }
  }
`;

const integrationsSaveMessengerConfigs = `
  mutation integrationsSaveMessengerConfigs($_id: String!, $messengerData: IntegrationMessengerData) {
    integrationsSaveMessengerConfigs(_id: $_id, messengerData: $messengerData) {
      _id
    }
  }
`;

const integrationsSaveMessengerAppearance = `
  mutation integrationsSaveMessengerAppearanceData($_id: String!, $uiOptions: MessengerUiOptions) {
    integrationsSaveMessengerAppearanceData(
      _id: $_id
      uiOptions: $uiOptions
    ) {
      _id
    }
  }
`;

const integrationsRemove = `
  mutation integrationsRemove($_id: String!) {
    integrationsRemove(_id: $_id)
  }
`;

const removeAccount = `
  mutation integrationsRemoveAccount($_id: String!) {
    integrationsRemoveAccount(_id: $_id)
  }
`;

const integrationsUpdateConfigs = `
  mutation integrationsUpdateConfigs($configsMap: JSON!) {
    integrationsUpdateConfigs(configsMap: $configsMap)
  }
`;

const integrationsArchive = `
  mutation integrationsArchive($_id: String!, $status: Boolean!) {
    integrationsArchive(_id: $_id, status: $status) {
      _idname
    }
  }
`;

const integrationsRepair = `
  mutation integrationsRepair($_id: String!) {
    integrationsRepair(_id: $_id) 
  }
`;

const integrationsSendSms = `
  mutation integrationsSendSms($integrationId: String!, $content: String!, $to: String!) {
    integrationsSendSms(integrationId: $integrationId, content: $content, to: $to)
  }
`;

export default {
  integrationsArchive,
  integrationsRepair,
  integrationsUpdateConfigs,
  integrationsCreateExternalIntegration,
  integrationsEditCommonFields,
  integrationsSaveMessengerConfigs,
  integrationsSaveMessengerAppearance,
  integrationsRemove,
  removeAccount,
  integrationsSendSms
};
