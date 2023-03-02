import { IModels } from '../connectionResolver';
import { sendRequest } from '@erxes/api-utils/src/requests';
import { ACTIONS } from './constants';
import utils from './utils';

/**
 * Get account list from Khanbank API
 * @param {IModels} models - Models
 * @param {string} configId - corporate gateway config id on erxes
 * @return {[object]} - Returns an array of accounts
 */
export const getAccounts = async (models: IModels, configId: string) => {
  const res = await utils.makeApiCall(
    models,
    configId,
    'GET',
    ACTIONS.ACCOUNTS
  );

  return res.accounts;
};

/**
 * Get account balance from Khanbank API
 * @param {IModels} models - Models
 * @param {string} configId - corporate gateway config id on erxes
 * @param {string} accountNumber - account number
 * @return {object} - Returns an account
 */
export const getAccountBalance = async (
  models: IModels,
  configId: string,
  accountNumber: string
) => {
  const res = await utils.makeApiCall(
    models,
    configId,
    'GET',
    `${ACTIONS.ACCOUNTS}/${accountNumber}/balance`
  );

  return res.account;
};

/**
 * Get account detail from Khanbank API
 * @param {IModels} models - Models
 * @param {string} configId - corporate gateway config id on erxes
 * @param {string} accountNumber - account number
 * @return {object} - Returns an account
 */
export const getAccountDetail = async (
  models: IModels,
  configId: string,
  accountNumber: string
) => {
  console.log('akjsdhkashdkahs');
  const res = await utils.makeApiCall(
    models,
    configId,
    'GET',
    `${ACTIONS.ACCOUNTS}/${accountNumber}`
  );

  console.log('*************** ', res);

  return res.account;
};
