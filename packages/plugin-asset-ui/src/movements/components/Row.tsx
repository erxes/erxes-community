import React from 'react';
import { IMovementType } from '../../common/types';
import moment from 'moment';
import { Button, ModalTrigger, router } from '@erxes/ui/src';
import Form from '../containers/Form';

type Props = {
  movement: IMovementType;
  history: any;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { movement } = this.props;

    const { createdAt, _id } = movement;

    const handleItems = () => {
      const { history } = this.props;
      history.push(`/asset-movement-items?movementId=${_id}`);
    };

    const renderRow = (
      <tr>
        <td>{_id}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
        <td>
          <Button btnStyle="link" icon="list-2" onClick={handleItems} />
        </td>
      </tr>
    );

    const renderDetail = props => {
      const updatedProps = {
        ...props,
        assetId: _id
      };

      return <Form {...updatedProps} />;
    };

    return (
      <ModalTrigger
        title="Detail Asset  Movement"
        content={renderDetail}
        trigger={renderRow}
        autoOpenKey="showListFormModal"
        dialogClassName="transform"
        size="lg"
      />
    );
  }
}

export default Row;
