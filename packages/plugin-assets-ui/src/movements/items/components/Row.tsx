import React from 'react';
import moment from 'moment';
import { IMovementItem } from '../../../common/types';
import { Icon, ModalTrigger, Tip, Button } from '@erxes/ui/src';
import Form from '../../containers/Form';

type Props = {
  item: IMovementItem;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  renderForm(assetId: string, movementId: string) {
    const content = props => {
      const updatedProps = {
        ...props,
        assetId,
        movementId
      };
      return <Form {...updatedProps} />;
    };

    const trigger = (
      <Button btnStyle="link">
        <Tip text="See detail of movement">
          <Icon icon="file-edit-alt" />
        </Tip>
      </Button>
    );

    return <ModalTrigger content={content} title="Detail Movement" trigger={trigger} size="xl" />;
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

    return (
      <tr>
        <td>{assetName}</td>
        <td>{(branch && branch?.title) || '-'}</td>
        <td>{(department && department.title) || '-'}</td>
        <td>{(teamMember && teamMember.name) || '-'}</td>
        <td>{(company && company.primaryName) || '-'}</td>
        <td>{(customer && customer.primaryEmail) || '-'}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
        <td>{this.renderForm(assetId, movementId)}</td>
      </tr>
    );
  }
}

export default Row;
