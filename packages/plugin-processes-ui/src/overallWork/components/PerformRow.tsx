import _ from 'lodash';
import React from 'react';
import { FinanceAmount } from '../../styles';
import Form from '../containers/PerformForm';
import moment from 'moment';
import queryString from 'query-string';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { IOverallWorkDet, IPerform } from '../types';

type Props = {
  overallWork: IOverallWorkDet;
  perform: IPerform;
  history: any;
  queryParams: any;
};

class PerformRow extends React.Component<Props> {
  displayLocInfo(obj) {
    if (!obj) {
      return '';
    }
    return `${obj.code} - ${obj.title}`;
  }

  displayWithNameInfo(obj) {
    if (!obj) {
      return '';
    }
    return `${obj.code} - ${obj.name}`;
  }
  displayValue(work, name) {
    const value = _.get(work, name);
    return <FinanceAmount>{(value || 0).toLocaleString()}</FinanceAmount>;
  }

  render() {
    const { perform, history, queryParams } = this.props;
    const onTrClick = () => {
      let typeFilter: any = { jobReferId: perform.overallWorkKey.typeId };
      if (!['job', 'end'].includes(perform.type)) {
        typeFilter = { productId: perform.overallWorkKey.typeId };
      }
      perform.type = history.push(
        `/processes/overallWorkDetail?${queryString.stringify({
          ...queryParams,
          ...perform.overallWorkKey,
          ...typeFilter
        })}`
      );
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const content = props => (
      <Form
        {...props}
        perform={perform}
        overallWorkDetail={this.props.overallWork}
      />
    );

    return (
      <tr onClick={onTrClick} key={Math.random()}>
        <td>{perform.count}</td>
        <td>{perform.status}</td>
        <td key={'actions'} onClick={onClick}>
          <ModalTrigger
            title="Edit perform"
            trigger={<Icon icon="edit" />}
            size="lg"
            content={content}
          />
        </td>
      </tr>
    );
  }
}

export default PerformRow;
