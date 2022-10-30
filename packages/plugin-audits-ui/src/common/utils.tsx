import { Spinner, Wrapper, DataWithLoader, __, Pagination } from '@erxes/ui/src';
import React from 'react';
import { audit_menu } from './constants';

export const DefaultWrapper = ({
  title,
  rightActionBar,
  loading,
  totalCount,
  content,
  sidebar,
  isPaginationHide
}: {
  title: string;
  rightActionBar?: JSX.Element;
  loading?: boolean;
  totalCount?: number;
  content: JSX.Element;
  sidebar?: JSX.Element;
  isPaginationHide?: boolean;
}) => {
  if (loading) {
    return <Spinner objective />;
  }
  return (
    <Wrapper
      header={<Wrapper.Header title={title} submenu={audit_menu} />}
      actionBar={<Wrapper.ActionBar right={rightActionBar} />}
      content={
        <DataWithLoader
          loading={loading || false}
          data={content}
          count={totalCount}
          emptyImage="/images/actions/5.svg"
          emptyText={__('No data of risk assessment')}
        />
      }
      leftSidebar={sidebar}
      footer={!isPaginationHide && <Pagination count={totalCount} />}
    />
  );
};
