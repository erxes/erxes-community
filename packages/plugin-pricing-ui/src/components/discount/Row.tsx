import React from 'react';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// erxes
import ActionButtons from '@erxes/ui/src/components/ActionButtons';
import Button from '@erxes/ui/src/components/Button';
import Tip from '@erxes/ui/src/components/Tip';
import Tags from '@erxes/ui/src/components/Tags';
import Icon from '@erxes/ui/src/components/Icon';
import { __ } from '@erxes/ui/src/utils';
import { DateWrapper } from '@erxes/ui/src/styles/main';

type Props = {
  data: any;
  remove: () => void;
};

const Row = (props: Props) => {
  const { data = {}, remove } = props;

  const archive = () => {};

  const renderActions = () => {
    return (
      <td>
        <ActionButtons>
          <Tip text={__('Statistic')} placement="bottom">
            <Button
              type="button"
              btnStyle="link"
              onClick={archive}
              size="small"
            >
              <Icon icon="graph-bar" />
            </Button>
          </Tip>
          <Tip text={__('Archive')} placement="bottom">
            <Button
              type="button"
              btnStyle="link"
              onClick={archive}
              size="small"
            >
              <Icon icon="archive-alt" />
            </Button>
          </Tip>
          <Tip text={__('Edit')} placement="bottom">
            <Link to="/pricing/discounts/edit">
              <Button type="button" btnStyle="link" size="small">
                <Icon icon="edit-3" />
              </Button>
            </Link>
          </Tip>
          <Tip text={__('Delete')} placement="bottom">
            <Button type="button" btnStyle="link" onClick={remove} size="small">
              <Icon icon="times-circle" />
            </Button>
          </Tip>
        </ActionButtons>
      </td>
    );
  };

  console.log(data);

  return (
    <tr>
      <td>{data.name && data.name}</td>
      <td>
        <Tags
          tags={[
            {
              _id: 'statusTag',
              type: '',
              name: data.status && data.status,
              colorCode: data.status === 'active' ? 'green' : 'grey'
            }
          ]}
        />
      </td>
      <td>
        <b>{data.createdUser && data.createdUser.details.fullName}</b>
      </td>
      <td>
        <Icon icon="calender" />{' '}
        <DateWrapper>
          {data.createdAt && dayjs(data.createdAt).format('ll')}
        </DateWrapper>
      </td>
      <td>
        <Icon icon="calender" />{' '}
        <DateWrapper>
          {data.updatedAt && dayjs(data.updatedAt).format('ll')}
        </DateWrapper>
      </td>
      {renderActions()}
    </tr>
  );
};

export default Row;
