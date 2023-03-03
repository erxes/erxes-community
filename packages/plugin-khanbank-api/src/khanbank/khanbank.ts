import { IKhanbankConfigDocument } from '../models/definitions/khanbankConfigs';
import { AccountsApi } from './api/accounts';
import { StatementsApi } from './api/statements';
import { TransferApi } from './api/transfer';

class Khanbank {
  public apiUrl: string;
  public consumerKey: string;
  public secretKey: string;
  public accounts: AccountsApi;
  public statements: StatementsApi;
  public transfer: TransferApi;

  constructor(config: IKhanbankConfigDocument) {
    const auth = {
      consumerKey: config.consumerKey,
      secretKey: config.secretKey
    };

    if (!auth.consumerKey || !auth.secretKey) {
      throw new Error('Consumer key and secret key are required');
    }

    this.consumerKey = config.consumerKey;
    this.secretKey = config.secretKey;

    this.apiUrl = `${process.env.KHANBANK_API_URL}/${process.env.KHANBANK_API_VERSION}`;

    this.accounts = new AccountsApi(this);
    this.statements = new StatementsApi(this);
    this.transfer = new TransferApi(this);
  }
}

export default Khanbank;
