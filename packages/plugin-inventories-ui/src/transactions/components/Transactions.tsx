import React from 'react';
// erxes
import { __ } from '@erxes/ui/src/utils';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
// local
import Actionbar from './Actionbar';
import List from '../containers/List';
import { SUBMENU } from '../../constants';

type Props = {
  data: any[];
  queryParams: any;
  history: any;
};

const Transactions = (props: Props) => {
  return (
    <Wrapper
      header={<Wrapper.Header title={__('Transactions')} submenu={SUBMENU} />}
      content={<List />}
      actionBar={<Actionbar />}
    />
  );
};

export default Transactions;
