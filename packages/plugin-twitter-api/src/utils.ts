import * as dotenv from 'dotenv';
import * as request from 'request-promise';
import * as sanitizeHtml from 'sanitize-html';
import memoryStorage from './inmemoryStorage';
import Configs from './models/Configs';
dotenv.config();

export const getEnv = ({
  name,
  defaultValue
}: {
  name: string;
  defaultValue?: string;
}): string => {
  const value = process.env[name];

  if (!value && typeof defaultValue !== 'undefined') {
    return defaultValue;
  }

  if (!value) {
  }

  return value || '';
};

/**
 * Compose functions
 * @param {Functions} fns
 * @returns {Promise} fns value
 */
export const compose = (...fns) => arg =>
  fns.reduceRight((p, f) => p.then(f), Promise.resolve(arg));

/*
 * Generate url depending on given file upload publicly or not
 */
export const generateAttachmentUrl = (urlOrName: string) => {
  const MAIN_API_DOMAIN = getEnv({ name: 'MAIN_API_DOMAIN' });

  if (urlOrName.startsWith('http')) {
    return urlOrName;
  }

  return `${MAIN_API_DOMAIN}/read-file?key=${urlOrName}`;
};

export const downloadAttachment = urlOrName => {
  return new Promise(async (resolve, reject) => {
    const url = generateAttachmentUrl(urlOrName);

    const options = {
      url,
      encoding: null
    };

    try {
      await request.get(options).then(res => {
        const buffer = Buffer.from(res, 'utf8');

        resolve(buffer.toString('base64'));
      });
    } catch (e) {
      reject(e);
    }
  });
};

export const getConfigs = async () => {
  const configsCache = await memoryStorage().get('configs_erxes_integrations');

  if (configsCache && configsCache !== '{}') {
    return JSON.parse(configsCache);
  }

  const configsMap = {};
  const configs = await Configs.find({});

  for (const config of configs) {
    configsMap[config.code] = config.value;
  }

  memoryStorage().set('configs_erxes_integrations', JSON.stringify(configsMap));

  return configsMap;
};

export const getConfig = async (code, defaultValue?) => {
  const configs = await getConfigs();

  if (!configs[code]) {
    return defaultValue;
  }

  return configs[code];
};
