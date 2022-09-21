import { colors, dimensions, SidebarList, typography } from '@erxes/ui/src';
import styled from 'styled-components';
import styledTS from 'styled-components-ts';

const ActionButtons = styled.div`
  display: flex;
  overflow: hidden;
  align-items: center;
  transition: all 0.3s ease;
  width: 0;

  * {
    padding: 0;
    margin-left: ${dimensions.unitSpacing}px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const SidebarListItem = styledTS<{ isActive: boolean; isParent?: boolean }>(
  styled.li
)`
    position: relative;
    border-bottom: 1px solid ${colors.borderPrimary};
    background: ${props => props.isActive && colors.bgActive};
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
  
    a {
      white-space: normal;
      flex: 1;
      padding: 10px 0 10px 20px;
      font-weight: 500;
  
      &:hover {
        background: none;
      }
  
      &:focus {
        color: inherit;
        text-decoration: none;
      }
  
      > span {
        color: #666;
        font-weight: normal;
        font-weight ${props => props.isParent && '500'};
      }
    }
  
    &:last-child {
      border: none;
    }
  
    &:hover {
      cursor: pointer;
      background: ${props => !props.isActive && colors.bgLight};
      ${ActionButtons} {
        width: 55px;
      }
      
    }
  `;

const List = styled(SidebarList)`
  li {
    border-bottom: 1px solid ${colors.borderPrimary};
    color: ${colors.textPrimary};
    white-space: normal;
    padding: ${dimensions.unitSpacing}px ${dimensions.coreSpacing}px;

    span {
      color: ${colors.colorCoreLightGray};
      margin: 0;
    }

    i {
      margin-left: ${dimensions.unitSpacing / 2}px;
    }

    &:last-child {
      border: none;
    }
  }
`;

const Action = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${dimensions.unitSpacing}px;
`;

const Name = styledTS<{ fontSize?: number }>(styled.div)`
  font-size: ${props => props.fontSize && `${props.fontSize}px`};
  font-weight: 500;

  i {
    margin-left: 10px;
    transition: all 0.3s ease;
    color: ${colors.colorCoreLightGray};

    &:hover {
      cursor: pointer;
      color: ${colors.colorCoreGray};
    }
  }
`;

export { SidebarListItem, ActionButtons, List, Action, Name };
