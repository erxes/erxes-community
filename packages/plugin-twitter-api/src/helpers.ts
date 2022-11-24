import Configs from './models/Configs';
import { set } from './inmemoryStorage';

export const resetConfigsCache = () => {
  set('twitter_integration_configs', '');
};

export const updateIntegrationConfigs = async (configsMap): Promise<void> => {
  await Configs.updateConfigs(configsMap);

  resetConfigsCache();
};
