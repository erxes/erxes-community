import { paginate } from '@erxes/api-utils/src';
import {
  checkPermission,
  requireLogin
} from '@erxes/api-utils/src/permissions';

import { IContext } from '../../../connectionResolver';
import { PAYMENT_KINDS, PAYMENT_STATUS } from '../../../constants';

interface IParam {
  searchValue?: string;
  kind?: string;
  status?: string;
  contentType?: string;
  contentTypeId?: string;
}

const generateFilterQuery = (params: IParam) => {
  const query: any = {};
  const { searchValue, kind, status, contentType, contentTypeId } = params;

  if (kind) {
    query.paymentKind = kind;
  }

  if (status) {
    query.status = status;
  }

  if (searchValue) {
    const regex = new RegExp(`.*${searchValue}.*`, 'i');
    query.description = regex;
  }

  if (contentType) {
    query.contentType = contentType;
  }

  if (contentTypeId) {
    query.contentTypeId = contentTypeId;
  }

  query.selectedPaymentId = { $exists: true };

  return query;
};

const queries = {
  async invoices(
    _root,
    params: IParam & {
      page: number;
      perPage: number;
    },
    { models }: IContext
  ) {
    const selector = generateFilterQuery(params);

    return paginate(models.Invoices.find(selector).sort({ createdAt: 1 }), {
      ...params
    });
  },

  async invoicesTotalCount(_root, params: IParam, { models }: IContext) {
    const counts = {
      total: 0,
      byKind: {},
      byStatus: { paid: 0, pending: 0, refunded: 0, failed: 0 }
    };

    const qry = {
      ...(await generateFilterQuery(params))
    };

    const count = async query => {
      return models.Invoices.find(query).countDocuments();
    };

    for (const kind of PAYMENT_KINDS.ALL) {
      const countQueryResult = await count({ paymentKind: kind, ...qry });
      counts.byKind[kind] = !params.kind
        ? countQueryResult
        : params.kind === kind
        ? countQueryResult
        : 0;
    }

    for (const status of PAYMENT_STATUS.ALL) {
      const countQueryResult = await count({ status, ...qry });
      counts.byStatus[status] = !params.status
        ? countQueryResult
        : params.status === status
        ? countQueryResult
        : 0;
    }

    counts.total = await count(qry);

    return counts;
  },

  async getInvoiceUrl(
    _root,
    {
      _id,
      customerId,
      companyId
    }: { _id: string; customerId: string; companyId: string },
    { models }: IContext
  ) {
    if (!customerId && !companyId) {
      throw new Error('customerId or companyId is required');
    }

    const qry: any = { _id };

    if (customerId) {
      qry.customerId = customerId;
    }

    if (companyId) {
      qry.companyId = companyId;
    }

    const invoice = await models.Invoices.findOne(qry);

    if (!invoice) {
      throw new Error(
        'Invoice had expired either by user or system, or not found'
      );
    }

    if (invoice.status === PAYMENT_STATUS.PAID) {
      throw new Error('Invoice had already been paid');
    }

    const MAIN_API_DOMAIN =
      process.env.MAIN_API_DOMAIN || 'http://localhost:4000';

    const base64 = Buffer.from(
      JSON.stringify({ ...invoice.toJSON() })
    ).toString('base64');

    return `${MAIN_API_DOMAIN}/pl:payment/gateway?params=${base64}`;
  }
};

requireLogin(queries, 'invoices');
checkPermission(queries, 'invoices', 'showInvoices', []);

export default queries;
