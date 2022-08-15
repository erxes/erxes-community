import React from 'react';
import dayjs from 'dayjs';
// erxes
import { Icon } from '@erxes/ui/src';
import { DateWrapper } from '@erxes/ui/src/styles/main';

type Props = {
  data: any;
};

const Row = (props: Props) => {
  const { data } = props;

  return (
    <tr>
      <td>{((data && data.branch) || {}).title || 'Branch'}</td>
      <td>{((data && data.department) || {}).title || 'Department'}</td>
      <td>{data && data.contentType}</td>
      <td>
        <Icon icon="calender" />{' '}
        <DateWrapper>
          {dayjs(data.createdAt).format('ll') || 'Created at'}
        </DateWrapper>
      </td>
    </tr>
  );
};

export default Row;
