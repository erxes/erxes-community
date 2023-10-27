import { __ } from '@erxes/ui/src/utils';
import React from 'react';
import { Wrapper } from '@erxes/ui/src/layout';
import { CollapseContent, DataWithLoader } from '@erxes/ui/src/components';
import Button from '@erxes/ui/src/components/Button';
import { menuDynamic } from '../constants';

type Props = {
  history: any;
  queryParams: any;
};

const InventoryProducts = ({ history, queryParams }: Props) => {
  const checkButton = (
    <>
      <Button btnStyle="warning" size="small" icon="check-1">
        Check
      </Button>
    </>
  );

  const header = <Wrapper.ActionBar right={checkButton} />;

  const content = (
    <>
      {header}
      <br />
      <CollapseContent title={__('Create products')}>
        <>Create products</>
      </CollapseContent>
      <CollapseContent title={__('Update products')}>
        <>Update products</>
      </CollapseContent>
      <CollapseContent title={__('Delete products')}>
        <>Delete products</>
      </CollapseContent>
    </>
  );

  return (
    <Wrapper
      header={
        <Wrapper.Header
          title={__('Check product')}
          queryParams={queryParams}
          submenu={menuDynamic}
        />
      }
      content={
        <DataWithLoader
          data={content}
          loading={false}
          count={1}
          emptyImage="/images/actions/1.svg"
        />
      }
      transparent={true}
      hasBorder={true}
    />
  );
};

export default InventoryProducts;
