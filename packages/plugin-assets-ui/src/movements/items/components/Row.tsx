import React from 'react';
import moment from 'moment';
import { IMovementItem } from '../../../common/types';

type Props = {
  item: IMovementItem;
};

class Row extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;

    const { assetName, branch, department, teamMember, company, customer, createdAt } = item;

    return (
      <tr>
        <td>{assetName}</td>
        <td>{(branch && branch?.title) || '-'}</td>
        <td>{(department && department.title) || '-'}</td>
        <td>{(teamMember && teamMember.name) || '-'}</td>
        <td>{(company && company.name) || '-'}</td>
        <td>{(customer && customer.primaryEmail) || '-'}</td>
        <td>{moment(createdAt || '').format('YYYY-MM-DD HH:mm')}</td>
      </tr>
    );
  }
}

export default Row;
