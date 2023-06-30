import { serviceDiscovery } from './configs';
// import { getEnv } from './video/utils';

// export const getSubServiceDomain = ({ name }: { name: string }): string => {
//   const MAIN_APP_DOMAIN = getEnv({ name: 'MAIN_APP_DOMAIN' });

//   const defaultMappings = {
//     API_DOMAIN: `${MAIN_APP_DOMAIN}/api`,
//     WIDGETS_DOMAIN: `${MAIN_APP_DOMAIN}/widgets`,
//     INTEGRATIONS_API_DOMAIN: `${MAIN_APP_DOMAIN}/integrations`,
//     LOGS_API_DOMAIN: `${MAIN_APP_DOMAIN}/logs`,
//     ENGAGES_API_DOMAIN: `${MAIN_APP_DOMAIN}/engages`,
//     VERIFIER_API_DOMAIN: `${MAIN_APP_DOMAIN}/verifier`,
//     AUTOMATIONS_API_DOMAIN: `${MAIN_APP_DOMAIN}/automations`
//   };

//   const domain = getEnv({ name });
//   if (domain) {
//     return domain;
//   }

//   return defaultMappings[name];
// };

export const getIntegrationMeta = async () => {
  const serviceNames = await serviceDiscovery.getServices();
  let metas: any = [];

  for (const serviceName of serviceNames) {
    const service = await serviceDiscovery.getService(serviceName, true);
    const inboxIntegrations = (service.config.meta || {}).inboxIntegrations || [];

    if (inboxIntegrations && inboxIntegrations.length > 0) {
      metas = metas.concat(inboxIntegrations);
    }
  }

  return metas;
};

export const getIntegrationsKinds = async () => {
  const metas = await getIntegrationMeta();

  const response = {
    messenger: 'Messenger',
    lead: 'Popups & forms',
    webhook: 'Webhook',
    booking: 'Booking',
    callpro: 'Callpro'
  };

  for (const meta of metas) {
    response[meta.kind] = meta.label;
  }

  return response;
};

export const isServiceRunning = async (integrationKind: string): Promise<boolean> => {
  const serviceNames = await serviceDiscovery.getServices();

  return integrationKind && serviceNames.includes(integrationKind.split('-')[0]);
};
