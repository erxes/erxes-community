import _ from 'lodash';
import Button from '@erxes/ui/src/components/Button';
import Form from '../containers/PerformForm';
import Icon from '@erxes/ui/src/components/Icon';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import React from 'react';
import Tip from '@erxes/ui/src/components/Tip';
import { __, confirm } from '@erxes/ui/src/utils';
import { FinanceAmount } from '../../styles';
import { IOverallWorkDet, IPerform } from '../types';

type Props = {
  overallWork: IOverallWorkDet;
  perform: IPerform;
  history: any;
  queryParams: any;
  removePerform: (_id: string) => void;
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

  remove = () => {
    const { removePerform, perform } = this.props;

    confirm(__('Remove this performance?')).then(() => {
      removePerform(perform._id || '');
    });
  };

  render() {
    const { perform } = this.props;
    const onTrClick = () => {};

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
            trigger={
              <Tip text={__('Edit')} placement="bottom">
                <Icon icon="edit" />
              </Tip>
            }
            size="xl"
            content={content}
          />
          <Button btnStyle="link" onClick={this.remove}>
            <Tip text={__('Delete')} placement="bottom">
              <Icon icon="trash-alt" />
            </Tip>
          </Button>
        </td>
      </tr>
    );
  }
}

export default PerformRow;
