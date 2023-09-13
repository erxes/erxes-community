const callsIntegrationDetail: string = `
  query callsIntegrationDetail($integrationId: String!) {
    callsIntegrationDetail(integrationId: $integrationId) {
      _id
      phone
      wsServer
      inboxId
      operators
      token
    }
  }
`;

const callsIntegrationOperator: any = `
  query callsIntegrationOperator {
    callsIntegrationOperator {
      _id
      inboxId
      operators
      phone
      wsServer
      token
    }
  }
`;

export default {
  callsIntegrationDetail,
  callsIntegrationOperator
};
