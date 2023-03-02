import Button from '@erxes/ui/src/components/Button';
import { IKbcgw, IType } from '../types';
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
  kbcgws: IKbcgw[];
  types: IType[];
  typeId?: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  remove: (kbcgw: IKbcgw) => void;
  edit: (kbcgw: IKbcgw) => void;
  loading: boolean;
};

function List({
  kbcgws,
  typeId,
  types,
  remove,
  renderButton,
  loading,
  edit
}: Props) {
  const trigger = (
    <Button id={'AddKbcgwButton'} btnStyle="success" icon="plus-circle">
      Add Kbcgw
    </Button>
  );

  const modalContent = props => (
    <Form
      {...props}
      types={types}
      renderButton={renderButton}
      kbcgws={kbcgws}
    />
  );

  const actionBarRight = (
    <ModalTrigger
      title={__('Add kbcgw')}
      trigger={trigger}
      content={modalContent}
      enforceFocus={false}
    />
  );

  const title = <Title capitalize={true}>{__('Kbcgw')}</Title>;

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
      <tbody id={'KbcgwsShowing'}>
        {kbcgws.map(kbcgw => {
          return (
            <Row
              space={0}
              key={kbcgw._id}
              kbcgw={kbcgw}
              remove={remove}
              edit={edit}
              renderButton={renderButton}
              kbcgws={kbcgws}
              types={types}
            />
          );
        })}
      </tbody>
    </Table>
  );

  const SideBarList = asyncComponent(() =>
    import(/* webpackChunkName: "List - Kbcgws" */ '../containers/SideBarList')
  );

  const breadcrumb = [
    { title: __('Settings'), link: '/settings' },
    { title: __('Kbcgws'), link: '/kbcgws' }
  ];

  return (
    <Wrapper
      header={<Wrapper.Header title={__('Kbcgws')} breadcrumb={breadcrumb} />}
      actionBar={actionBar}
      content={
        <DataWithLoader
          data={content}
          loading={loading}
          count={kbcgws.length}
          emptyText={__('Theres no kbcgw')}
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
