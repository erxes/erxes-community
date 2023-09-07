import React from 'react';
import { withRouter } from 'react-router-dom';

import Box from '@erxes/ui/src/components/Box';
import Icon from '@erxes/ui/src/components/Icon';
import { IRouterProps } from '@erxes/ui/src/types';
import { __, router } from '@erxes/ui/src/utils';
import { FieldStyle, SidebarList } from '@erxes/ui/src/layout/styles';
import { categoryStatusChoises } from '../../../utils';

interface IProps extends IRouterProps {
  searchable?: boolean;
}

class CategoryStatusFilter extends React.Component<IProps> {
  render() {
    const { history } = this.props;
    const productParam = 'productStatus';
    const categoryParam = 'categoryStatus';

    const onClear = () => {
      router.setParams(history, { productStatus: null });
      router.setParams(history, { categoryStatus: null });
    };

    const productStatus = router.getParam(history, productParam);
    const categoryStatus = router.getParam(history, categoryParam);

    const extraButtons = (productStatus || categoryStatus) && (
      <a href="#cancel" tabIndex={0} onClick={onClear}>
        <Icon icon="cancel-1" />
      </a>
    );

    const onClick = (key, value) => {
      console.log('key', key);
      console.log('value', value);
      router.setParams(history, { [key]: value });
      router.setParams(history, { categoryId: null });
      if (key === 'productStatus') {
        router.setParams(history, { categoryStatus: null });
      } else {
        router.setParams(history, { productStatus: null });
      }
    };

    return (
      <Box
        extraButtons={extraButtons}
        title={__('Filter by status')}
        name="showFilterByType"
      >
        <SidebarList>
          <p
            style={{
              marginLeft: '20px',
              marginTop: '10px',
              fontWeight: 500
            }}
          >
            {__('FILTER PRODUCT BY STATUS')}
          </p>
          <ul style={{ paddingLeft: '40px' }}>
            {categoryStatusChoises(__).map(
              ({ value, label }: { value: string; label: string }) =>
                (value === 'active' || value === 'deleted') && (
                  <li key={Math.random()} style={{ display: 'list-item' }}>
                    <a
                      href="#filter"
                      tabIndex={0}
                      className={
                        router.getParam(history, [productParam]) === value
                          ? 'active'
                          : ''
                      }
                      onClick={onClick.bind(this, productParam, value)}
                    >
                      <FieldStyle>{label}</FieldStyle>
                    </a>
                  </li>
                )
            )}
          </ul>
          <p style={{ marginLeft: '20px', marginTop: '10px', fontWeight: 500 }}>
            {__('FILTER CATEGORY BY STATUS')}
          </p>
          <ul>
            {categoryStatusChoises(__).map(
              ({ value, label }: { value: string; label: string }) =>
                (value === 'disabled' || value === 'archived') && (
                  <li key={Math.random()}>
                    <a
                      href="#filter"
                      tabIndex={0}
                      className={
                        router.getParam(history, [categoryParam]) === value
                          ? 'active'
                          : ''
                      }
                      onClick={onClick.bind(this, categoryParam, value)}
                    >
                      <FieldStyle>{label}</FieldStyle>
                    </a>
                  </li>
                )
            )}
          </ul>
        </SidebarList>
      </Box>
    );
  }
}

export default withRouter<IProps>(CategoryStatusFilter);
