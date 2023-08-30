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

    const onClear = () => {
      router.setParams(history, { status: null });
    };

    const extraButtons = router.getParam(history, 'status') && (
      <a href="#cancel" tabIndex={0} onClick={onClear}>
        <Icon icon="cancel-1" />
      </a>
    );

    const paramKey = 'status';

    const onClick = (key, value) => {
      router.setParams(history, { [key]: value });
      router.setParams(history, { categoryId: null });
    };

    return (
      <Box
        extraButtons={extraButtons}
        title={__('Filter by status')}
        name="showFilterByType"
      >
        <SidebarList>
          <li>
            <Box title={__('FILTER PRODUCT BY STATUS')} name="showfilerByType">
              {categoryStatusChoises(__).map(
                ({ value, label }: { value: string; label: string }) =>
                  (value === 'active' || value === 'deleted') && (
                    <a
                      href="#filter"
                      tabIndex={0}
                      className={
                        router.getParam(history, [paramKey]) === value
                          ? 'active'
                          : ''
                      }
                      onClick={onClick.bind(this, paramKey, value)}
                    >
                      <FieldStyle>{label}</FieldStyle>
                    </a>
                  )
              )}
            </Box>

            <Box
              title={__('FILTER CATEGORY BY STATUS')}
              name="showFilterByType"
            >
              {categoryStatusChoises(__).map(
                ({ value, label }: { value: string; label: string }) =>
                  (value === 'disabled' || value === 'archived') && (
                    <li key={Math.random()}>
                      <a
                        href="#filter"
                        tabIndex={0}
                        className={
                          router.getParam(history, [paramKey]) === value
                            ? 'active'
                            : ''
                        }
                        onClick={onClick.bind(this, paramKey, value)}
                      >
                        <FieldStyle>{label}</FieldStyle>
                      </a>
                    </li>
                  )
              )}
            </Box>
          </li>
        </SidebarList>
      </Box>
    );
  }
}

export default withRouter<IProps>(CategoryStatusFilter);
