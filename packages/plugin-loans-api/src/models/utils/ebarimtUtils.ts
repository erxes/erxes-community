import { sendMessageBroker } from '../../messageBroker';
import { ITransaction } from '../definitions/transactions';

async function createEbarimt(
  subdomain: string,
  ebarimtConfig: {},
  transaction: ITransaction
) {
  const ebarimt = await sendMessageBroker({}, '');
}
