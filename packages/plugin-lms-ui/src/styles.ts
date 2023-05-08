import { colors, dimensions } from '@erxes/ui/src/styles';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';
import { SidebarListItem } from '@erxes/ui-settings/src/styles';
import { SidebarList } from '@erxes/ui/src/layout/styles';
import { lighten } from '@erxes/ui/src/styles/ecolor';

const SideList = styledTS<{
  isActive?: boolean;
  level?: number;
}>(styled(SidebarListItem))`
  white-space: normal !important;
  border: 0;
  padding-left: ${props => `${(props.level || 0) * 30 + 20}px !important`};
  padding: 6px 20px !important;

  > span {
    width: 90%;
    display: flex;
    color: ${props => props.isActive && colors.colorPrimary};

    &:hover {
      color: ${props => !props.isActive && lighten(colors.textPrimary, 40)};
    }

    > i {
      margin-right: 5px;
      color: ${props =>
        props.isActive
          ? colors.colorPrimary
          : !props.level || props.level === 0
          ? colors.colorCoreBlue
          : colors.colorCoreGreen};
    }
  }

  &:hover {
    background: ${props => !props.isActive && colors.bgLight};
  }
`;

export { SideList };
