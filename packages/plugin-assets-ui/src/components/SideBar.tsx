import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import React from 'react';
import { IProductCategory } from '../../../ui-products/src/types';
import AssetsCategoryList from '../containers/AssetsCategoryList';
import { IProduct } from '../types';

function Sidebar({
  queryParams,
  history,
  renderButton
}: {
  queryParams: any;
  // loadingMainQuery: boolean;
  history: any;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
}) {
  return (
    <Wrapper.Sidebar>
      <AssetsCategoryList
        queryParams={queryParams}
        history={history}
        renderButton={renderButton}
      />
    </Wrapper.Sidebar>
  );
}

export default Sidebar;
