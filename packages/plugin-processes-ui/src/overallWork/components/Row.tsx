import _ from 'lodash';
import Button from '@erxes/ui/src/components/Button';
import Detail from '../containers/Detail';
import React from 'react';
import { ModalTrigger, confirm } from '@erxes/ui/src';
import { FinanceAmount } from '../../styles';
import { IOverallWork } from '../types';
import moment from 'moment';

type Props = {
  work: IOverallWork;
  history: any;
  onSyncErkhet: (workId: string) => void;
  onReturnBill: (workId: string) => void;
};

class PutResponseRow extends React.Component<Props> {
  displayValue(work, name) {
    const value = _.get(work, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  }

  modalContent = _props => {
    const { work } = this.props;

    return <Detail work={work} />;
  };

  render() {
    const { work } = this.props;

    const onClick = e => {
      e.stopPropagation();
    };

    const trigger = (
      <tr>
        <td key={'cashAmount'}>{this.displayValue(work, 'cashAmount')}</td>
        <td key={'receivableAmount'}>
          {this.displayValue(work, 'receivableAmount')}
        </td>
        <td key={'cardAmount'}>{this.displayValue(work, 'cardAmount')}</td>
        <td key={'mobileAmount'}>{this.displayValue(work, 'mobileAmount')}</td>
        <td key={'totalAmount'}>{this.displayValue(work, 'totalAmount')}</td>

        <td key={'actions'} onClick={onClick}></td>
      </tr>
    );

    return (
      <ModalTrigger
        title={`Order detail`}
        trigger={trigger}
        autoOpenKey="showProductModal"
        content={this.modalContent}
        size={'lg'}
      />
    );
  }
}

export default PutResponseRow;
