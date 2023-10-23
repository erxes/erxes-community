import Button from '@erxes/ui/src/components/Button';
import { IMsdynamic, IType } from '../types';
import Row from './Row';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import Form from './Form';
import { Title } from '@erxes/ui-settings/src/styles';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import Table from '@erxes/ui/src/components/table';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import asyncComponent from '@erxes/ui/src/components/AsyncComponent';

type Props = {
  msdynamics: IMsdynamic[];
  types: IType[];
  typeId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (msdynamic: IMsdynamic) => void;
  edit: (msdynamic: IMsdynamic) => void;
  loading: boolean;
};

function List({
  msdynamics,
  typeId,
  types,
  remove,
  renderButton,
  loading,
  edit
}: Props) {
  const trigger = (
    <Button id={'AddMsdynamicButton'} btnStyle="success" icon="plus-circle">
      Add Msdynamic
    </Button>
  );

  const modalContent = props => (
    <Form
      {...props}
      types={types}
      renderButton={renderButton}
      msdynamics={msdynamics}
    />
  );

  const actionBarRight = (
    <ModalTrigger
      title={__('Add msdynamic')}
      trigger={trigger}
      content={modalContent}
      enforceFocus={false}
    />
  );

  const title = <Title capitalize={true}>{__('Msdynamic')}</Title>;

  const actionBar = (
    <Wrapper.ActionBar left={title} right={actionBarRight} wideSpacing />
  );

  const content = (
    <Table>
      <thead>
        <tr>
          <th>{__('Todo')}</th>
          <th>{__('Expiry Date')}</th>
          <th>{__('Actions')}</th>
        </tr>
      </thead>
      <tbody id={'MsdynamicsShowing'}>
        {msdynamics.map(msdynamic => {
          return (
            <Row
              space={0}
              key={msdynamic._id}
              msdynamic={msdynamic}
              remove={remove}
              edit={edit}
              renderButton={renderButton}
              msdynamics={msdynamics}
              types={types}
            />
          );
        })}
      </tbody>
    </Table>
  );

  const SideBarList = asyncComponent(() =>
    import(
      /* webpackChunkName: "List - Msdynamics" */ '../containers/SideBarList'
    )
  );

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Msdynamics'), link: '/msdynamics' }
  ];

  return (
    <Wrapper
      header={
        <Wrapper.Header title={__('Msdynamics')} breadcrumb={breadcrumb} />
      }
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={msdynamics.length}
          emptyText={__('Theres no msdynamic')}
          emptyImage="/images/actions/8.svg"
        />
      }
      leftSidebar={<SideBarList currentTypeId={typeId} />}
      transparent={true}
      hasBorder
    />
  );
}

export default List;
