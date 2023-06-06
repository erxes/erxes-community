import React from 'react';
import moment from 'moment';
import { Icon, Label } from '@erxes/ui/src';
import { Link } from 'react-router-dom';

type Props = {
  item: any;
};

class Row extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { item } = this.props;

    const tableRow = (
      <tr>
        <td>{item.mainType || '-'}</td>
        <td>{item?.relType || '-'}</td>
        <td>
          <Label lblStyle="default">{item.status}</Label>
        </td>
        <td>{moment(item?.createdAt).format('ll HH:mm') || '-'}</td>
        <td>
          {item.closedAt
            ? moment(item.closedAt).format('ll HH:mm') || '-'
            : '-'}
        </td>
        <td>
          <Link
            to={`/rcfa/detail/${item._id}`}
            style={{ color: 'rgb(68, 68, 68)' }}
          >
            <Icon icon="next-3" /> Detail
          </Link>
        </td>
      </tr>
    );

    return tableRow;
  }
}

export default Row;
