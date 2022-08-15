import React from 'react';
// erxes
import { __ } from '@erxes/ui/src/utils/core';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Button from '@erxes/ui/src/components/Button';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import Table from '@erxes/ui/src/components/table';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import EmptyState from '@erxes/ui/src/components/EmptyState';
import { IRouterProps } from '@erxes/ui/src/types';
// local
import { ISafeRemainder } from '../types';
import { SUBMENU } from '../../constants';
import Form from '../containers/Form';
import Row from './Row';
import Sidebar from './Sidebar';

interface IProps extends IRouterProps {
  history: any;
  queryParams: any;
  remainders: ISafeRemainder[];
  totalCount: number;
  loading: boolean;
  removeRemainder: (remainder: ISafeRemainder) => void;
}

class List extends React.Component<IProps, {}> {
  constructor(props: any) {
    super(props);
  }

  renderRow = () => {
    const { remainders, history, removeRemainder } = this.props;

    return (remainders || []).map(rem => (
      <Row
        history={history}
        key={rem._id}
        remainder={rem}
        removeRemainder={removeRemainder}
      />
    ));
  };

  render() {
    const { loading, queryParams, history, totalCount } = this.props;

    const trigger = (
      <Button btnStyle="success" icon="plus-circle">
        Add safe remainder
      </Button>
    );

    const modalContent = (props: any) => <Form {...props} history={history} />;

    let actionBarRight = (
      <ModalTrigger
        title="Add Product/Services"
        trigger={trigger}
        autoOpenKey="showAddSafeRemainderModal"
        content={modalContent}
        size="lg"
      />
    );

    let content = (
      <>
        <Table>
          <thead>
            <tr>
              <th>{__('Date')}</th>
              <th>{__('Branch')}</th>
              <th>{__('Department')}</th>
              <th>{__('Product Category')}</th>
              <th>{__('Description')}</th>
              <th>{__('Status')}</th>
              <th>{__('ModifiedAt')}</th>
              <th>{__('ModifiedBy')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>{this.renderRow()}</tbody>
        </Table>
      </>
    );

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Safe Remainders')} submenu={SUBMENU} />
        }
        actionBar={<Wrapper.ActionBar right={actionBarRight} />}
        leftSidebar={<Sidebar queryParams={queryParams} history={history} />}
        footer={<Pagination count={totalCount} />}
        content={
          <DataWithLoader
            data={content}
            loading={loading}
            count={totalCount}
            emptyContent={
              <EmptyState
                image="/images/actions/5.svg"
                text="No transactions"
                size=""
              />
            }
          />
        }
      />
    );
  }
}

export default List;
