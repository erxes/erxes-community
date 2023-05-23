import React from 'react';
import moment from 'moment';
import { ModalTrigger } from '@erxes/ui/src';
import TableDetail from './TableDetail';

type Props = {
  item: any;
};

class Row extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { item } = this.props;

    const trigger = (
      <tr>
        <td>{item.mainType || '-'}</td>
        <td>{item?.sourceType || '-'}</td>
        <td>{item?.source?.name || '-'}</td>
        <td>{item?.type || '-'}</td>
        {/* <td>{item?.name || '-'}</td> */}
        <td>{moment(item?.createdAt).format('ll HH:mm') || '-'}</td>
        <td>
          {item.closedAt
            ? moment(item.closedAt).format('ll HH:mm') || '-'
            : '-'}
        </td>
      </tr>
    );

    const content = () => {
      return <TableDetail item={item} />;
    };

    return (
      <ModalTrigger title="Detail RCFA" content={content} trigger={trigger} />
    );
  }
}

export default Row;
