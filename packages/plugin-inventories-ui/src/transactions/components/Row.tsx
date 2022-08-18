import React from 'react';
import dayjs from 'dayjs';
// erxes
import { __ } from '@erxes/ui/src/utils/core';
import Icon from '@erxes/ui/src/components/Icon';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import { DateWrapper } from '@erxes/ui/src/styles/main';

type Props = {
  data: any;
};

const Row = (props: Props) => {
  const { data } = props;

  const content = () => (
    <div>
      {((data && data.branch) || {}).title || 'Branch'}
      <br />
      {((data && data.department) || {}).title || 'Department'}
      <br />
      {data && data.contentType}
      <br />
      {dayjs(data.createdAt).format('ll') || 'Created at'}
    </div>
  );

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
      <td>
        <div>
          <ModalTrigger
            size="xl"
            title={__('Transaction')}
            trigger={
              <Button btnStyle="link">
                <Tip text="View" placement="top">
                  <Icon icon="eye" />
                </Tip>
              </Button>
            }
            content={content}
            dialogClassName="wide-modal"
          />
        </div>
      </td>
    </tr>
  );
};

export default Row;
