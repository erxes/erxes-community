import { Button, Icon, ModalTrigger, Tip } from '@erxes/ui/src';
import moment from 'moment';
import React from 'react';
import { IMovementItem } from '../../../common/types';
import Form from '../../containers/Form';

type Props = {
  item: IMovementItem;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderForm({
    assetId,
    movementId,
    trigger,
    modaltText,
    item
  }: {
    assetId?: string;
    movementId?: string;
    modaltText: string;
    item?: IMovementItem;
    trigger: React.ReactNode;
  }) {
    const content = props => {
      const updatedProps = {
        ...props,
        assetId,
        movementId,
        item
      };
      return <Form {...updatedProps} />;
    };

    return (
      <ModalTrigger
        content={content}
        title={`${modaltText} Movement`}
        trigger={trigger}
        size="xl"
      />
    );
  }

  render() {
    const { item } = this.props;

    const {
      assetId,
      assetName,
      movementId,
      branch,
      department,
      teamMember,
      company,
      customer,
      createdAt
    } = item;

    const editTrigger = (
      <Button btnStyle="link" style={{ padding: 0 }}>
        <Tip text="See detail of movement" placement="bottom">
          <Icon icon="file-edit-alt" />
        </Tip>
      </Button>
    );

    const addTrigger = (
      <Button btnStyle="link" style={{ padding: 0 }}>
        <Tip text="add to new movement" placement="bottom">
          <Icon icon="file-plus-alt" />
        </Tip>
      </Button>
    );

    return (
      <tr>
        <td>{assetName}</td>
        <td>{(branch && branch?.title) || '-'}</td>
        <td>{(department && department.title) || '-'}</td>
        <td>{(teamMember && teamMember?.details?.fullName) || '-'}</td>
        <td>{(company && company.primaryName) || '-'}</td>
        <td>{(customer && customer.primaryEmail) || '-'}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
        <td style={{ width: 60 }}>
          {this.renderForm({ modaltText: 'Detail', assetId, movementId, trigger: editTrigger })}
          {this.renderForm({ modaltText: 'Add', trigger: addTrigger, item })}
        </td>
      </tr>
    );
  }
}

export default Row;
