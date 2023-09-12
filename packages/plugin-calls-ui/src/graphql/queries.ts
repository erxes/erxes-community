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

export default {
  callsIntegrationDetail
};
