import { QueryResponse } from '@erxes/ui/src/types';

export interface IKhanbankTransactionItem {
  amount: number;
  balance: number;
  branch: string;
  code: number;
  correction: number;
  debit: number;
  description: string;
  journal: number;
  postDate: string;
  record: number;
  relatedAccount: string;
  teller: string;
  time: string;
  tranDate: string;
}

export interface IKhanbankStatement {
  account: string;
  beginBalance: number;
  beginDate: string;
  branch: string;
  branchName: string;
  currency: string;
  customerName: string;
  endBalance: number;
  endDate: string;
  iban: string;
  productName: string;
  total: {
    count: number;
    credit: number;
    debit: number;
  };
  transactions: IKhanbankTransactionItem[];
}

export type StatementQueryResponse = {
  khanbankStatements: IKhanbankStatement;

  loading: boolean;
  refetch: () => void;
} & QueryResponse;
