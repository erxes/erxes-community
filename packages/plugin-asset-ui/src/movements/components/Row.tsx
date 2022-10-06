import React from 'react';
import { IMovementType } from '../../common/types';
import moment from 'moment';
import { Button, ModalTrigger } from '@erxes/ui/src';
import Form from '../containers/Form';

type Props = {
  movement: IMovementType;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { movement } = this.props;

    const {
      assetName,
      branch,
      department,
      teamMember,
      company,
      customer,
      createdAt,
      _id
    } = movement;

    const renderRow = (
      <tr>
        <td>{assetName}</td>
        <td>{(branch && branch?.title) || '-'}</td>
        <td>{(department && department.title) || '-'}</td>
        <td>{(teamMember && teamMember.name) || '-'}</td>
        <td>{(company && company.name) || '-'}</td>
        <td>{(customer && customer.name) || '-'}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
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
