import { colors, dimensions } from '@erxes/ui/src';
import styled, { css } from 'styled-components';
import styledTS from 'styled-components-ts';

export const StyledContent = styled.div`
  padding: 1rem 1rem 0.5rem 1rem;
`;

export const StyledListItem = styled.div`
  padding: 10px;
`;
export const Divider = styled.div`
  text-align: center;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${colors.colorCoreLightGray};
  margin: 20px 0;

  > span {
    margin: 0 20px;
  }

  &:before,
  &:after {
    content: '';
    flex: 1;
    height: 0;
    align-self: center;
    border-bottom: 1px solid ${colors.borderPrimary};
  }
`;

export const SidebarHeader = styled.h5`
  margin-bottom: ${dimensions.coreSpacing}px;
  color: ${colors.colorPrimary};
  padding-left: 10px;
`;
export const ListItem = styledTS<{
  column?: number;
}>(styled.div)`
  display:flex;
  justify-content:space-between;
  background: ${colors.colorWhite};
  padding: 5px;
  margin-bottom: 10px;
  border-left: 2px solid transparent; 
  border-top: none;
  border-radius: 4px;
  box-shadow: none;
  left: auto;
  align-items:center;
  padding:20px 10px

  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    box-shadow: 0 2px 8px ${colors.shadowPrimary};
    border-color: ${colors.colorSecondary};
    border-top: none;
    cursor: pointer;
  }
  ${props =>
    props.column &&
    css`
      width: ${100 / props.column}%;
      display: inline-block;
    `}
`;

export const ItemBtn = styledTS<{
  color?: string;
}>(styled.div)`
  color: ${({ color }) => (color ? color : '')};
  text-align: end;

  &:hover {
    cursor: pointer;
  }
`;

export const IssueItem = styled.div`
  background-color: #0000000f;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
`;
