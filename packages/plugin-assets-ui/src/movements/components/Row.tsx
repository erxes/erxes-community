import React from 'react';
import { IMovementType } from '../../common/types';
import moment from 'moment';
import { Button, ModalTrigger, FormControl } from '@erxes/ui/src';
import Form from '../containers/Form';
import { Link } from 'react-router-dom';

type Props = {
  movement: IMovementType;
  history: any;
  isChecked: boolean;
  toggleBulk?: (movement: IMovementType, movementId: string, isChecked?: boolean) => void;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { movement, isChecked, toggleBulk } = this.props;

    const { createdAt, _id, user, movedAt } = movement;

    const handleItems = () => {
      const { history } = this.props;
      history.push(`/asset-movement-items?movementId=${_id}`);
    };

    const onClick = e => {
      e.stopPropagation();
    };

    const onChange = e => {
      if (toggleBulk) {
        toggleBulk(movement, _id || '', e.target.checked);
      }
    };

    const renderRow = (
      <tr>
        <td onClick={onClick}>
          <FormControl checked={isChecked} componentClass="checkbox" onChange={onChange} />
        </td>
        <td>{_id || ''}</td>
        <td>
          <Link to={`/settings/team/details/${user._id}`}>{user.email}</Link>
        </td>
        <td>{moment(movedAt || '').format('YYYY-MM-DD HH:mm')}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
        <td>
          <Button btnStyle="link" icon="list-2" onClick={handleItems} />
        </td>
      </tr>
    );

    const renderDetail = props => {
      const updatedProps = {
        ...props,
        movementId: _id
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
        size="xl"
      />
    );
  }
}

export default Row;
